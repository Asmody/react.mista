
export const requestBanner = () => ({
    type: 'REQUEST_BANNER'
})

export const receiveBanner = (banner) => ({
    type: 'RECEIVE_BANNER',
    items: banner,
    receivedAt: Date.now()
})

export const fetchBanner = (id) => (dispatch, getState) => {
    
    console.log('fetch banner');
    dispatch(requestBanner());

    let banner = {
        href: "http://edu.1c.ru/spec/default.asp?utm_source=mista&amp;utm_medium=ny&amp;utm_campaign=spec0902",
        img: "https://forum.mista.ru/css/1c-edu5.png"
    }
    console.log(banner);
    dispatch(receiveBanner(banner));
    /*
    return fetchJsonp(`https://www.mista.ru/api/message.php?id=${topicId}`)
        .then(response => response.json())
        .then(json => dispatch(receiveTopic(json)))
    */    
  }