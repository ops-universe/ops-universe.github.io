import React from 'react';
import {renderToString} from 'react-dom/server';
import App from './App.jsx';
export {routes} from './data.mjs';
export function render(path){return renderToString(<App path={path}/>);}
