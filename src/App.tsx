import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import { getIntrospectionQuery, IntrospectionQuery } from 'graphql';
import { Uri, editor, KeyMod, KeyCode, languages } from 'monaco-editor';
import { initializeMode } from 'monaco-graphql/esm/initializeMode';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import * as JSONC from 'jsonc-parser';
import { debounce } from './debounce';
import "bootstrap/dist/css/bootstrap.min.css";



import Header from './components/Header';
import { Editor } from './components/Editor';
import { IDE } from './pages/IDE';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';

const fetcher = createGraphiQLFetcher({
  url: 'https://reefscan.com/graphql',
});


export default function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<IDE />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='*' element={<NotFound />} />
          {/* <Editor /> */}
        </Routes>
      </Router>

    </>
  );
}
