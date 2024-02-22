'use client'

import ReactDOM from 'react-dom';

export function PreloadResources() {
    ReactDOM.preconnect(`https://${process.env.ALGOLIA_APP_ID}-dsn.algolia.net`)
}