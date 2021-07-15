import {Helmet} from 'react-helmet';

import React from 'react'

const MetaData = ({title}) => {
    return (
        <Helmet>
            <title>{`${title}-ShopIt`}</title>
        </Helmet>
    )
}

export default MetaData;
