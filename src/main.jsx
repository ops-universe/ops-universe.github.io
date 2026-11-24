import React from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import App from './App.jsx';
import './style.css';
const root=document.getElementById('root');
const app=<App path={location.pathname}/>;
if(root.querySelector('.site'))hydrateRoot(root,app);else createRoot(root).render(app);
