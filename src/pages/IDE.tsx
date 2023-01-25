import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/prism";
import "prismjs/themes/prism.css"; //Example style, you can use another
import FixedElements from "../components/FixedElements";
import HTMLRenderer from "../components/HTMLRenderer";
import storage from "../storage";
import WebEvents from "../webEvents";
import SettingsModal from "../modals/SettingsModal";
import { useHistory } from "react-router-dom";

const defaultTabs = {
  html: {
    name: "📃",
    icon: "code",
    language: "html",
    code: `<h1 class='text-6xl text-center mt-4'>Welcome to Web.eth</h1>`,
  },
  css: {
    name: "🖌️",
    icon: "code",
    language: "css",
    code: `body, html { padding: 0; margin: 0; }`,
  },
  js: {
    name: "🧩",
    icon: "code",
    language: "js",
    code: `console.log("Hello World")`,
  },
  ".xens": {
    name: "📜",
    icon: "code",
    language: "txt",
    code: `{"name": "Web.eth"}`,
  },
};

function IDE({ theme }) {
  const [selectedTab, setSelectedTab] = useState("html");
  const [tabs, setTabs] = useState(defaultTabs);
  const [currentCode, setCode] = useState(
    storage.getPagePreference(selectedTab) || tabs[selectedTab].code
  );
  const [showPreview, setShowPreview] = useState(true);
  const [showCode, setShowCode] = useState(true);
  const [codeBuffer, setCodeBuffer] = useState(currentCode);
  const [overlayPreview, setOverlayPreview] = React.useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme || null);
  const eventEmitterCallbackRef = useRef(null);
  const themeRef = useRef(theme || null);
  const [shouldShowSettings, setShouldShowSettings] = useState(false);
  const cooldown = useRef(null);
  const savedCode = useRef({});
  const history = useHistory();

  //code for the h1 text animation is in the animation.ts file
  useEffect(() => {
    if (
      themeRef.current === null &&
      storage.getGlobalPreference("default_theme")
    )
      setCurrentTheme(storage.getGlobalPreference("default_theme"));

    if (eventEmitterCallbackRef.current === null) {
      eventEmitterCallbackRef.current = () => {
        if (
          themeRef.current === null &&
          storage.getGlobalPreference("default_theme")
        )
          setCurrentTheme(storage.getGlobalPreference("default_theme"));
      };
    }

    WebEvents.off("reload", eventEmitterCallbackRef.current);
    WebEvents.on("reload", eventEmitterCallbackRef.current);

    return () => {
      WebEvents.off("reload", eventEmitterCallbackRef.current);
    };
  }, []);

  if (!savedCode.current[selectedTab])
    savedCode.current[selectedTab] = currentCode;
  return (
    <div data-theme={currentTheme}>
      <div className="flex flex-col lg:flex-row w-full overflow-hidden">
        <div
          className="w-50 lg:w-full md:w-full overflow-y-scroll min-h-screen max-h-screen"
          hidden={!showCode || (overlayPreview && !showPreview)}
        >
          <div
            className="inline-flex w-full rounded-sm border-1 shadow-sm overflow-hidden z-50"
            role="group"
          >
            {Object.keys(tabs).map((tabIndex) => {
              let tab = tabs[tabIndex];
              return (
                <button
                  data-selected={selectedTab === tabIndex}
                  className="btn rounded-none border-none text-white hover:text-white hover:bg-black"
                  onClick={() => {
                    clearTimeout(cooldown.current);
                    storage.setPagePreference(
                      selectedTab,
                      savedCode.current[selectedTab] || tabs[tabIndex].code
                    );
                    storage.saveData();
                    setSelectedTab(tabIndex);
                    setCode(savedCode.current[tabIndex] || tabs[tabIndex].code);
                  }}
                >
                  {tab.name}
                </button>
              );
            })}
            <button className="btn rounded-none bg-pink-500 text-white hover:text-white hover:bg-black">
              📦
            </button>
            <button className="btn rounded-none bg-pink-500 text-white hover:text-white hover:bg-black">
              🗃️
            </button>
            <button className="btn rounded-none bg-warning animate-pulse text-white hover:text-white hover:bg-black">
              🌟
            </button>
          </div>
          <Editor
            value={currentCode}
            onValueChange={(code) => {
              setCode(code);

              //wait for the user to stop typing
              clearTimeout(cooldown.current);
              cooldown.current = setTimeout(() => {
                storage.setPagePreference(selectedTab, code);
                storage.saveData();
                savedCode.current[selectedTab] = code;
                setCodeBuffer(code);
              }, 800);
            }}
            highlight={(code) =>
              highlight(code, languages[tabs[selectedTab].language || "html"])
            }
            padding={24}
            className="z-50"
            spellCheck={true}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              background: "rgba(0,0,0,0.1)",
              ...(!overlayPreview ? { border: "1px solid black" } : {}),
            }}
          />
        </div>
        <div
          className={"h-full " + (showPreview ? "w-full" : "w-auto")}
          style={{
            borderLeft: "1px solid black",
            ...(overlayPreview
              ? {
                  position: "absolute",
                  left: "0",
                  opacity: 0.4,
                  marginTop: 40,
                }
              : {}),
          }}
        >
          <div
            hidden={!showPreview}
            className={"h-full w-full"}
            style={{
              ...(overlayPreview
                ? {
                    pointerEvents: "none",
                    touchEvents: "none",
                    paddingTop: 20,
                    width: "90%",
                    marginLeft: "5%",
                    paddingLeft: 20,
                  }
                : {}),
            }}
          >
            <HTMLRenderer
              code={savedCode.current}
              stylesheets={[
                "https://cdn.jsdelivr.net/npm/daisyui@2.47.0/dist/full.css",
              ]}
              meta={[
                {
                  tag: "title",
                  children: "web3.eth",
                },
              ]}
              scripts={["https://cdn.tailwindcss.com"]}
              currentFile={selectedTab}
              style={{
                ...(!overlayPreview
                  ? {
                      height: "93vh",
                      border: "1px solid black",
                    }
                  : {}),
              }}
            />
          </div>
          <div
            className={
              "w-full bg-gray-700 border-1 border-black p-2 " +
              (showPreview
                ? "flex flex-col lg:flex-row md:flex-row"
                : "flex flex-col") +
              " " +
              (overlayPreview && showPreview ? "h-40" : "")
            }
          >
            <button
              className="btn rounded-none bg-pink-500 border-none text-white hover:text-white hover:bg-black"
              onClick={() => setShowPreview(!showPreview)}
            >
              {!showPreview ? "Show Preview" : "Hide Preview"}
            </button>
            <button
              className="btn rounded-none bg-pink-500 border-none text-white hover:text-white hover:bg-black"
              onClick={() => setShowCode(!showCode)}
            >
              {!showCode ? "Show Code" : "Hide Code"}
            </button>
            <button
              className="btn rounded-none bg-pink-500 border-none text-white hover:text-white hover:bg-black"
              onClick={() => setOverlayPreview(!overlayPreview)}
            >
              {!overlayPreview ? "Overlay Preview" : "Stop Overlaying Preview"}
            </button>
            <button className="btn rounded-none bg-info border-none text-white hover:text-white hover:bg-black">
              💾
            </button>
            <button className="btn rounded-none bg-info border-none text-white hover:text-white hover:bg-black">
              📁
            </button>
            <button
              className="btn rounded-none bg-transparent border-none text-white hover:text-white hover:bg-black w-50"
              onClick={() => {
                setShouldShowSettings(!shouldShowSettings);
              }}
            >
              ⚙️
            </button>
            <button
              className="btn rounded-none bg-transparent border-none text-white hover:text-white hover:bg-black w-50"
              onClick={() => {
                history.push("/");
              }}
            >
              🏠
            </button>
          </div>
        </div>
      </div>
      <FixedElements
        hideAlerts={false}
        hideSettings={true}
        hideFooter={true}
        hideUserInfo={true}
      />
      <SettingsModal
        hidden={!shouldShowSettings}
        onHide={() => {
          setShouldShowSettings(false);
        }}
      />
    </div>
  );
}

IDE.propTypes = {
  theme: PropTypes.string,
};

export default IDE;
