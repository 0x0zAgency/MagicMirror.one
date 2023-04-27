/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import storage from '../storage';
import { Web3Context } from '../contexts/web3Context';
import WebEvents from '../webEvents';
import { useHistory } from 'react-router-dom';
import HeartIcon from '../components/Icons/HeartIcon';
import ViewIcon from '../components/Icons/ViewIcon';
import config from '../config';

const avatars = {
  html: '/img/html.png',
  css: '/img/css.png',
  js: '/img/js.png',
  javascript: '/img/js.png',
  ts: '/img/ts.png',
  json: '/img/json.png',
};

function PublishModal({ hidden, onHide, savedData = {}, tabs = {} }) {
  const defaultThemeRef = useRef(null);
  const context = useContext(Web3Context);
  const [currentTheme, setCurrentTheme] = useState(config.defaultTheme);
  const eventEmitterCallbackRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
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

  let tabSize = Object.values(tabs || {}).length;
  let contents = '';
  let size = 0;
  let limit = config.fileSizeLimit; //10mb limit
  Object.values(tabs).forEach((tab: any) => {
    console.log(tab);
    contents += tab.code;
    tab.size = new Blob([tab.code]).size;
    tab.size = (tab.size / 1024 / 1024).toFixed(3);
  });
  size = new Blob([contents]).size;
  size = parseFloat((size / 1024 / 1024).toFixed(3));

  let totalPercent = Math.floor((size / limit) * 100);
  let tabKeys = Object.keys(tabs);

  return (
    <div
      data-theme={currentTheme}
      className="mx-auto sm:w-3/5 md:w-3/5 lg:w-4/5 fixed inset-0 flex items-center overflow-y-auto z-50 bg-transparent"
      hidden={hidden}
    >
      <div className="bg-white rounded-md w-full overflow-y-auto max-h-screen shadow shadow-lg border-2">
        <div className="flex flex-col w-full">
          <div className="bg-pink-400 p-2 text-black text-3xl">
            <b>🌟</b>
          </div>
          <div className="flex flex-col p-2 w-full mt-2">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <HeartIcon />
                </div>
                <div className="stat-title">Files</div>
                <div className="stat-value text-primary">{tabSize}</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-primary">
                  <ViewIcon />
                </div>
                <div className="stat-title">Paypload Size</div>
                <div className="stat-value text-primary">{size}mb</div>
                <div className="stat-desc">
                  {totalPercent}% of limit ({config.fileSizeLimit}mb)
                </div>
              </div>
            </div>
            <div className="overflow-x-auto w-full mt-4">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th />
                    <th>Name</th>
                    <th>Size</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {Object.values(tabs).map((tab: any, index: number) => {
                    return (
                      <tr key={index}>
                        <th className="text-center">
                          <label>✅</label>
                        </th>
                        <td>
                          <div className="flex items-center space-x-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12">
                                <img
                                  src={avatars[tab.language]}
                                  alt="Avatar Tailwind CSS Component"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">
                                {tab.language.toUpperCase()}
                              </div>
                              <div className="text-sm opacity-50">
                                {tab.name} - {tabKeys[index]}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{tab.size}mb</td>
                        <th></th>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPercent > 100 ? (
              <>
                <div className="text-red-500 text-center mt-3">
                  <b>⚠️</b> Your total payload size is over the limit of 12mb
                </div>
              </>
            ) : (
              <></>
            )}
            {size === 0 ? (
              <>
                <div className="text-red-500 text-center mt-3">
                  <b>⚠️</b> All of your files are empty
                </div>
              </>
            ) : (
              <></>
            )}
            <div className="btn-group w-full mt-2">
              <button
                className="btn"
                disabled={totalPercent > 100 || size === 0 || tabSize === 0}
              >
                Publish
              </button>
              <button
                className="btn btn-error"
                onClick={() => {
                  if (onHide) onHide();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

PublishModal.propTypes = {
  hidden: PropTypes.bool,
  tabs: PropTypes.object,
  onHide: PropTypes.func,
};

export default PublishModal;
