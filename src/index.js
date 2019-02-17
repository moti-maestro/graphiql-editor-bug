'use strict'

import React from 'react'
import ReactDOM from 'react-dom'

import GraphiQL from 'graphiql'

import './style.scss'

const fetch = () => Promise.resolve()

ReactDOM.render(<GraphiQL fetcher={fetch} />, document.getElementById('app-root'))
