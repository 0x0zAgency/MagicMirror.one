import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import FixedElements from "../components/FixedElements";
import SettingsModal from "../modals/SettingsModal";
import { ENSContext } from "../contexts/ensContext";
import { withRouter, useHistory } from "react-router-dom";
import { Web3File, Web3Response } from "web3.storage";
import HTMLRenderer from "../components/HTMLRenderer";
import { getIPFSProvider } from "../helpers";
import { Web3StorageProvider } from "../ipfs";

const parseCDI = async (files: Web3File[], setPercentage: Function) => {
  let partialFiles = files.filter(
    (file) => file.name.indexOf(".partial") !== -1
  );
  let indexFiles = files.filter((file) => file.name === "index.html");

  let html;
  if (indexFiles.length === 0 && partialFiles.length === 0) {
    //no index.html found
    return {
      valid: false,
    };
  } else if (partialFiles.length > 0) {
    //found partial files
    let partialHtml = partialFiles.filter(
      (file) => file.name === "index.partial"
    )[0];
    let partialCss = partialFiles.filter(
      (file) => file.name === "css.partial"
    )[0];
    let partialJS = partialFiles.filter(
      (file) => file.name === "js.partial"
    )[0];
    let partialXens = partialFiles.filter((file) => file.name === ".xens")[0];

    let struct = {};
    if (partialHtml !== undefined)
      struct["html"] = new TextDecoder().decode(
        (await partialHtml.stream().getReader().read()).value
      );

    if (partialCss !== undefined)
      struct["css"] = new TextDecoder().decode(
        (await partialCss.stream().getReader().read()).value
      );
    if (partialJS !== undefined)
      struct["js"] = new TextDecoder().decode(
        (await partialJS.stream().getReader().read()).value
      );

    if (partialXens !== undefined)
      struct[".xens"] = new TextDecoder().decode(
        (await partialXens.stream().getReader().read()).value
      );

    return {
      valid: true,
      direct: false,
      source: struct,
    };
  } else if (indexFiles.length > 0) {
    //just use the index.html and draw render it to an iframe
    let potentialHTML = indexFiles[0];
    setPercentage(65);
    html = await potentialHTML.stream().getReader().read();
    html = new TextDecoder().decode(html.value);
    return {
      valid: true,
      direct: true,
      source: html,
    };
  }

  return {
    valid: false,
  };
};

const prepareDefaultContent = async (setPercentage: Function) => {
  //get the default content
  let defaultContent = await fetch("/audio.html");
  let html = await defaultContent.text();
  setPercentage(100);
  return html;
};

function Viewer({ match }) {
  const [shouldShowSettings, setShouldShowSettings] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [empty, setEmpty] = useState(false);
  const [defaultResponse, setDefaultResponse] = useState(false);
  const [direct, setDirect] = useState(false);
  const [dir, setDir] = useState(null);
  const [buffer, setBuffer] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [hasSetMatch, setHasSetMatch] = useState(false);
  const ensContext = useContext(ENSContext);
  const abortRef = useRef(null);
  const matchRef = useRef(null);
  const ipfsProvider = useRef<Web3StorageProvider>(null);
  const history = useHistory();

  if (ipfsProvider.current === null)
    ipfsProvider.current = getIPFSProvider(
      "web3-storage"
    ) as Web3StorageProvider;

  useEffect(() => {
    matchRef.current = match.params.token;
    if (ensContext.currentEnsAddress !== matchRef.current) {
      if (abortRef.current !== null) abortRef.current.abort();
      ensContext.setCurrentEnsAddress(match.params.token);
    }
  }, [ensContext, match.params.token, hasSetMatch]);

  useEffect(() => {
    if (!ensContext.loaded) return;
    if (ensContext.currentEnsAddress === null) return;
    if (ensContext.currentEnsAddress !== matchRef.current) return;
    if (loaded) return;

    let main = async () => {
      try {
        let isEmpty = false;

        setPercentage(10);
        if (
          ensContext.contentHash === null ||
          ensContext.contentHash.trim().length === 0
        ) {
          isEmpty = true;
        } else {
          let abortController = new AbortController();
          abortRef.current = abortController;
          setPercentage(20);
          let directory = await ipfsProvider.current.getDirectory(
            ensContext.contentHash,
            abortRef.current
          );
          setPercentage(30);
          let files = await directory.files();

          setPercentage(50);
          if (files.length === 0) {
            isEmpty = true;
          } else {
            let parsedCDI = await parseCDI(files, setPercentage);
            setDir(files);
            if (parsedCDI.valid) {
              if (parsedCDI.direct) {
                setDirect(true);
              } else {
                setDirect(false);
              }
              setBuffer(parsedCDI.source);
            } else isEmpty = true;
          }
        }

        if (isEmpty) {
          let defaultContent = await prepareDefaultContent(setPercentage);
          setDefaultResponse(defaultContent !== null);
          setBuffer(defaultContent);
          isEmpty = defaultContent === null;
        }

        setEmpty(isEmpty);
        setLoaded(true);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoaded(true);
      }
    };
    //call async
    main();
    return () => {
      if (abortRef.current !== null) abortRef.current.abort();
    };
  }, [ensContext, loaded]);

  useEffect(() => {}, []);
  return (
    <div>
      <div className="hero min-h-screen" hidden={loaded}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content bg-warning">
          <div className="max-w-md">
            <h1 className="mb-2 text-5xl font-bold text-black truncate">
              Loading{" "}
            </h1>
            <h2 className="mb-3 text-3xl text-black truncate underline">
              {ensContext.currentEnsAddress}
            </h2>
            <p className="mb-5 text-black">
              This may take a few seconds, please be patient.
            </p>
            <div
              className="radial-progress bg-warning text-warning-content"
              style={{ "--value": percentage } as any}
            >
              {percentage + "%"}
            </div>
          </div>
        </div>
      </div>
      <div
        className="hero min-h-screen"
        hidden={
          !loaded || empty || ensContext.ensError !== null || error !== null
        }
      >
        {buffer !== null && ensContext.ensError === null ? (
          <>
            {direct ? (
              <iframe
                title={ensContext.currentEnsAddress}
                style={{ width: "100%", height: "100%" }}
                src={
                  "https://dweb.link/ipfs/" +
                  ensContext.contentHash
                    .replace("ipfs://", "")
                    .replace("ipns://", "")
                }
              ></iframe> ? (
                !defaultResponse
              ) : (
                <HTMLRenderer
                  code={buffer.source}
                  currentFile={
                    (ensContext.currentEnsAddress || "null") + ".web3"
                  }
                />
              )
            ) : (
              <HTMLRenderer
                implicit={buffer}
                currentFile={(ensContext.currentEnsAddress || "null") + ".web3"}
              />
            )}
          </>
        ) : (
          <div className="hero min-h-screen">
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content bg-error">
              <div className="max-w-md">
                <h1 className="mb-5 text-5xl font-bold text-black">
                  Bad Buffer
                </h1>
                <p className="mb-5 text-black">
                  It appears that the buffer is not a valid HTML file.
                </p>
                <button
                  className="btn btn-dark w-full"
                  onClick={() => {
                    history.push("/");
                  }}
                >
                  Home
                </button>
                <button
                  className="btn btn-dark w-full mt-2"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="hero-overlay bg-opacity-60"></div>
      {/** Completely Empty Box */}
      <div
        className="hero min-h-screen"
        hidden={
          !loaded ||
          !empty ||
          error !== null ||
          ensContext.ensError !== null ||
          defaultResponse
        }
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content bg-error">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold text-black">
              Completely Empty
            </h1>
            <p className="mb-5 text-black">
              This ENS address appears to have content hash associated with it.
              We also couldn't find any files in the directory, we also couldn't
              pull enough data including twitter, email or reddit to assemble a
              basic template.
            </p>
            <button
              className="btn btn-dark w-full"
              onClick={() => {
                history.push("/");
              }}
            >
              Home
            </button>
            <button
              className="btn btn-dark w-full mt-2"
              onClick={() => {
                window.location.reload();
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
      {/** ENS Error Box */}
      <div
        className="hero min-h-screen"
        hidden={!loaded || ensContext.ensError === null}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content bg-error">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold text-black">
              404 Not Found
            </h1>
            <p className="mb-5 text-black">
              This ENS address does not exist and is can be purchased right now!
            </p>
            <button
              className="btn btn-dark w-full"
              onClick={() => {
                history.push("/");
              }}
            >
              Home
            </button>
            <button
              className="btn btn-dark w-full mt-2"
              onClick={() => {
                window.location.reload();
              }}
            >
              Purchase
            </button>
          </div>
        </div>
      </div>
      {/** Error Box */}
      <div className="hero min-h-screen" hidden={error === null || empty}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content bg-error">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold text-black">Malfuction</h1>
            <p className="mb-5 text-black underline truncate">
              {error !== null ? error.message : null}
            </p>
            <p className="mb-5 text-black">
              This is likely due to an issue with the ENS address or the
              content. If you believe this is an error, please contact us.
            </p>
            <button
              className="btn btn-dark w-full"
              onClick={() => {
                history.push("/");
              }}
            >
              Home
            </button>
            <button
              className="btn btn-dark w-full mt-2"
              onClick={() => {
                window.location.reload();
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
      <FixedElements
        hideSettings={!loaded}
        onSettings={() => {
          if (!loaded) return;
          setShouldShowSettings(!shouldShowSettings);
        }}
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

Viewer.propTypes = {
  match: PropTypes.object,
};

export default withRouter(Viewer);
