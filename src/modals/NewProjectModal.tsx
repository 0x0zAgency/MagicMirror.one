import React, { useRef, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import storage from '../storage';
import { Web3Context } from '../contexts/web3Context';
import WebEvents from '../webEvents';
import config from '../config';
import { useHistory } from 'react-router-dom';
import Hero from '../components/Hero';
import ChatGPTHeader from '../components/ChatGPTHeader';
const defaultTemplates: any = {};

let fetchContent = async (contentIndex: string = 'audio.html') => {
  if (contentIndex[0] !== '/') contentIndex = '/' + contentIndex;
  // Get the default content
  const defaultContent = await fetch(contentIndex);
  const html = await defaultContent.text();
  //take everything inbetween script tags
  let script = html.match(/<script>(.*?)<\/script>/s);
  let fScript = (script[1] as any) || '';
  //take everything inbetween style tags
  let style = html.match(/<style>(.*?)<\/style>/s);
  let fStyle = (style[1] as any) || '';

  //remove script tags from html
  let parsedHTML = html.replace(/<script>(.*?)<\/script>/s, '');

  //also remove script tags that have attributes in the tag
  parsedHTML = parsedHTML.replace(/<script(.*?)>(.*?)<\/script>/s, '');

  //remove style tags
  parsedHTML = parsedHTML.replace(/<style>(.*?)<\/style>/s, '');

  return { parsedHTML, script: fScript, style: fStyle };
};

const defaultTabs = {
  html: {
    name: '📃',
    icon: 'code',
    language: 'html',
    code: '',
  },
  css: {
    name: '🖌️',
    icon: 'code',
    language: 'css',
    code: '/* custom css code */',
  },
  js: {
    name: '🧩',
    icon: 'code',
    language: 'javascript',
    code: '//custom javascript code',
  },
  '.xens': {
    name: '📜',
    icon: 'code',
    language: 'json',
    code: '',
  },
};

defaultTemplates.basic = {
  name: 'Start From Scratch',
  description: 'Start with nothing and build your own project',
  onSelection: (tabs: any, setCode: any) => {
    //should do stuff and set up the project
    let result = {
      ...defaultTabs,
    };

    result['.xens'] = {
      ...result['.xens'],
      code: JSON.stringify(
        {
          name: 'Magic Mirror',
          description: 'A Magic Mirror',
          author: 'Magic Mirror',
          version: '0.0.1',
          direct: false,
        },
        null,
        2
      ),
    };

    setCode({
      ...result,
    });
  },
};

defaultTemplates.advanced = {
  name: 'Scripting Example',
  description:
    'Start with some JavaScript and HTML demonstrating how to use the Magic🪞 API',
  onSelection: (tabs: any, setCode: any) => {
    //should do stuff and set up the project
    let result = {
      ...defaultTabs,
    };

    result.html.code = `
        <html>
            <head>
                <title>🧙‍♂️.Magic🪞.eth</title>
            </head>
            <body>
                <p id='ens'>NO ENS</p>
                <p id='address'>NO ADDRESS</p>
            </body>
        </html>
    `;

    result.js.code = `
        const {currentEnsAddress, owner } = window.ensContext;
        document.getElementById('ens').innerText = currentEnsAddress;
        document.getElementById('address').innerText = owner;
    `;

    result['.xens'] = {
      ...result['.xens'],
      code: JSON.stringify(
        {
          name: 'Magic🪞(XENS)',
          description: 'A simple example of how to use the Magic🪞 API',
          author: 'Magic Mirror',
          version: '0.0.1',
          direct: false,
        },
        null,
        2
      ),
    };

    setCode(result);
  },
};

defaultTemplates.redirect = {
  name: 'Magic🪞.eth Reflection',
  description: 'Set up a 🪞 to redirect to another domain',
  onSelection: (tabs: any, setCode: any) => {
    //should do stuff and set up the project
    let result = {
      ...defaultTabs,
    };

    result['.xens'] = {
      ...result['.xens'],
      code: JSON.stringify(
        {
          name: 'Magic🪞.eth Reflection',
          description: 'A simple redirect to another website',
          author: 'Magic🪞',
          version: '0.0.1',
          direct: true,
        },
        null,
        2
      ),
    };

    result.js.code = `   
      setTimeout(() => {
        window.location.href = 'https://magicmirror.one';
        }, 1000);
    `;

    result.html.code = `
        <html>
            <head>
                <title>Magic🪞.eth Reflecting</title>
            </head>
            <body>
                <p>Reflecting...</p>
            </body>
        </html>
    `;

    setCode(result);
  },
};

defaultTemplates.web3Mirror = {
  name: 'Magic🪞.eth Web2<>ENS Refraction',
  description:
    'Set up a your 🪞 to refract the light of your web2 site into your ENS domain',
  onSelection: (tabs: any, setCode: any) => {
    //should do stuff and set up the project
    let result = {
      ...defaultTabs,
    };

    result['.xens'] = {
      ...result['.xens'],
      code: JSON.stringify({
        name: 'Magic🪞.eth Refraction',
        description: 'A refraction to a web2 website',
        author: '0x0z.Agency',
        version: '0.0.1',
        direct: true,
      }),
    };

    result.html.code = `
        <html>
            <head>
                <title>Magic🪞.eth</title>
            </head>
            <body>
                <iframe src="https://pod.infinitymint.app" style="width: 100vw; height: 100vh; border: none;" 
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-popups-to-escape-sandbox"
                ></iframe>
            </body>
        </html>
      `;

    setCode(result);
  },
};

defaultTemplates.embeded = {
  name: 'Magic🪞.eth Embedding',
  description: 'Example of how to embed content into Magic🪞.eth',
  onSelection: (tabs: any, setCode: any) => {
    //should do stuff and set up the project
    let result = {
      ...defaultTabs,
    };

    result['.xens'] = {
      ...result['.xens'],
      code: JSON.stringify({
        name: 'Magic🪞.eth',
        description: 'An example of how to embed content into Magic🪞.eth',
        version: '0.0.1',
        direct: false,
      }),
    };

    result.html.code = `
        <html>
            <head>
                <title>Magic🪞.eth Embedding</title>
            </head>
            <body>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/z62_AwLC7-g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </body>
        </html>
        `;

    setCode(result);
  },
};

defaultTemplates.music = {
  name: '🎧Club.eth',
  description:
    'Setup a basic music project using your own music. You can choose to use our own theme for the website or work on your own.',
  onSelection: (tabs: any, setCode: any) => {
    //fetch the default music template
    let result = {
      ...defaultTabs,
    };

    (async () => {
      let { parsedHTML, script, style } = await fetchContent('audio.html');
      result['.xens'] = {
        ...result['.xens'],
        code: JSON.stringify(
          {
            name: 'Magic🪞.eth',
            description:
              'Setup a basic music project using your own music. You can choose to use our own theme for the website or work on your own.',
            version: '0.0.1',
            libs: {
              bootstrap: '4',
            },
            direct: false,
          },
          null,
          2
        ),
      };
      result.html.code = parsedHTML;
      result.js.code = script;
      result.css.code = style;
      setCode(result);
    })();
  },
};

defaultTemplates.video = {
  name: 'NewTube.eth',
  description:
    'Setup a basic video project using your own video. You can choose to use our own theme for the website or work on your own.',
  onSelection: (tabs: any, setCode: any) => {
    //fetch the default music template
    let result = {
      ...defaultTabs,
    };

    (async () => {
      let { parsedHTML, script, style } = await fetchContent('video.html');
      result['.xens'] = {
        ...result['.xens'],
        code: JSON.stringify(
          {
            name: 'Magic🪞.eth',
            description:
              'Setup a basic video project using your own videos. You can choose to use our own theme for the website or work on your own.',
            version: '0.0.1',
            libs: {
              bootstrap: '4',
            },
            direct: false,
          },
          null,
          2
        ),
      };
      result.html.code = parsedHTML;
      result.js.code = script;
      result.css.code = style;
      setCode(result);
    })();
  },
};

defaultTemplates.image = {
  name: 'Image',
  description:
    'Setup a basic image project using your own image. You can choose to use our own theme for the website or work on your own.',
  onSelection: (tabs: any, setCode: any) => {
    //fetch the default music template
    let result = {
      ...defaultTabs,
    };

    (async () => {
      let { parsedHTML, script, style } = await fetchContent('images.html');
      result['.xens'] = {
        ...result['.xens'],
        code: JSON.stringify(
          {
            name: 'Magic🪞.eth',
            description:
              'Setup a basic image project using your own images. You can choose to use our own theme for the website or work on your own.',
            version: '0.0.1',
            libs: {
              bootstrap: '4',
            },
            direct: false,
          },
          null,
          2
        ),
      };
      result.html.code = parsedHTML;
      result.js.code = script;
      result.css.code = style;
      setCode(result);
    })();
  },
};

defaultTemplates.links = {
  name: '♾️links.eth',
  description: 'Set up your own free and infinite links page.',
  onSelection: (tabs: any, setCode: any) => {
    //should do stuff and set up the project
    let result = {
      ...defaultTabs,
    };

    result['.xens'] = {
      ...result['.xens'],
      code: JSON.stringify({
        name: '♾️links.eth',
        description: 'A free and infinite links page',
        author: '0x0z.Agency',
        version: '0.0.1',
        direct: true,
      }),
    };

    result.html.code = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>♾️LINKS</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100">
        <header class="bg-white shadow-md py-4 px-8">
            <!-- Header text -->
            <h1 class="text-3xl font-bold text-gray-900 inline">
                My Title
            </h1>
            <!-- Header image -->
            <!-- <img src="your-image-url" alt="My Title" class="h-10 w-auto inline"> -->
        </header>
        <main class="container mx-auto mt-8">
            <ul class="space-y-4">
                <li>
                    <a href="https://example.com" class="inline-block px-4 py-2 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md">
                        <img src="your-inline-image-url" alt="Button 1" class="h-5 w-auto inline mr-2">
                        Button 1
                    </a>
                </li>
                <li>
                    <a href="https://example.com" class="inline-block px-4 py-2 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md">
                        <img src="your-inline-image-url" alt="Button 2" class="h-5 w-auto inline mr-2">
                        Button 2
                    </a>
                </li>
                <li>
                    <a href="https://example.com" class="inline-block px-4 py-2 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md">
                        <img src="your-inline-image-url" alt="Button 3" class="h-5 w-auto inline mr-2">
                        Button 3
                    </a>
                </li>
            </ul>
        </main>
    </body>
    </html>
    
      `;

    setCode(result);
  },
};

defaultTemplates.blog = {
  name: 'Blog',
  description: 'Set up a blog with your own content.',
};

defaultTemplates.portfolio = {
  name: 'Portfolio',
  description: 'Set up a portfolio with your own content.',
};

function NewProjectModal({ hidden, onHide, tabs = {}, setCode }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [currentTheme, setCurrentTheme] = useState('forest');
  const eventEmitterCallbackRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    setTemplates(Object.values(defaultTemplates));
    if (storage.getGlobalPreference('defaultTheme')) {
      setCurrentTheme(storage.getGlobalPreference('defaultTheme'));
    }

    if (eventEmitterCallbackRef.current === null) {
      eventEmitterCallbackRef.current = () => {
        if (storage.getGlobalPreference('defaultTheme')) {
          setCurrentTheme(storage.getGlobalPreference('defaultTheme'));
        }
      };
    }

    WebEvents.off('reload', eventEmitterCallbackRef.current);
    WebEvents.on('reload', eventEmitterCallbackRef.current);

    return () => {
      WebEvents.off('reload', eventEmitterCallbackRef.current);
    };
  }, []);

  // Disables scrolling while this modal is active
  useEffect(() => {
    if (!hidden) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [hidden]);

  let hasCode = false;
  for (let key in tabs) {
    if (tabs[key].code !== '') {
      hasCode = true;
      break;
    }
  }

  return (
    <div
      data-theme={currentTheme}
      className="mx-auto sm:w-3/5 md:w-3/5 lg:w-4/5 fixed inset-0 flex items-center overflow-y-auto z-50 bg-transparent"
      hidden={hidden}
    >
      <div className="bg-white rounded-md w-full overflow-y-auto max-h-screen shadow shadow-lg border-2">
        <div className="flex flex-col w-full">
          <div className="bg-gray-400 p-2 text-black text-3xl">
            <b>⚙️</b>
          </div>
          <ChatGPTHeader
            bg="bg-gray-400"
            children={
              <>
                <div className="p-2 w-full mt-4">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl text-black text-center md:text-right lg:text-right mb-4">
                    Dream🎨.eth
                  </h1>
                  <div className="hidden md:block lg:block">
                    <p className="text-black text-1xl lg:text-2xl text-right">
                      Welcome to the Dream🎨.eth Magic dWeb Studio.
                    </p>
                    <p className="text-black text-1xl lg:text-2xl  text-right">
                      You can use it to create <u>anything</u> you like.
                    </p>
                    <p className="text-black text-1xl  lg:text-2xl  text-right">
                      Your imagination is the limit.
                    </p>
                    <p className="text-black text-1xl lg:text-2xl  text-right">
                      You can start by selecting a template.
                    </p>
                  </div>
                </div>
              </>
            }
          />
          <div className="flex flex-col flex-1 p-3">
            {hasCode ? (
              <div className="bg-red-500 text-white p-2 rounded-md">
                <p className="font-bold">Warning</p>
                <p>
                  Your current project will be lost if you continue. You might
                  want to save!
                </p>
                <p
                  style={{
                    fontSize: 10,
                  }}
                >
                  You can save your project by clicking the '💾' button.
                </p>
              </div>
            ) : (
              <></>
            )}
            <div className="flex flex-row items-center justify-between mt-2">
              <p className="text-black text-2xl">Templates</p>
              <div className="flex flex-row items-center">
                <div className="flex flex-row items-center justify-center ml-2 gap-2">
                  <div
                    hidden={selectedTemplate === null}
                    className="flex flex-row items-center justify-center p-2 rounded-md border-2 border-gray-400 cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      //create new project using template
                      if (selectedTemplate.onSelection) {
                        selectedTemplate.onSelection(tabs, setCode);
                      } else
                        setCode({
                          ...defaultTabs,
                        });
                    }}
                  >
                    <p className="text-black">Use Template</p>
                  </div>
                  <div
                    className="flex flex-row items-center justify-center p-2 rounded-md border-2 border-red-400 cursor-pointer hover:bg-red-500"
                    onClick={() => {
                      onHide();
                    }}
                  >
                    <p className="text-black hover:text-white">Cancel</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-1 mt-4 gap-2">
              {templates.map((template, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-between p-2 rounded-md border-2 border-gray-400 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setSelectedTemplate(template);
                  }}
                >
                  <div className="flex flex-col">
                    <p className="text-black">{template.name}</p>
                    <p className="text-gray-400">{template.description}</p>
                  </div>
                  <div className="flex flex-row items-center">
                    <h2 className="text-black">
                      {selectedTemplate === template ? '✅' : ''}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-row items-center justify-between mt-2  hidden lg:block">
              <p className="text-black text-2xl">
                {selectedTemplate === null ? '' : selectedTemplate.name}
                <span
                  className="text-gray-400"
                  style={{
                    fontSize: '0.5em',
                  }}
                >
                  {selectedTemplate === null
                    ? ''
                    : ` - ${selectedTemplate.description}`}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

NewProjectModal.propTypes = {
  hidden: PropTypes.bool,
  onHide: PropTypes.func,
  setCode: PropTypes.func,
};

export default NewProjectModal;
