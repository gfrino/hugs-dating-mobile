import Polyline from '@mapbox/polyline'

export const getDirections = async (
  startLoc,
  destinationLoc,
  apiKey,
  callback,
) => {
  try {
    let resp = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc.latitude},${startLoc.longitude}&destination=${destinationLoc.latitude},${destinationLoc.longitude}&key=` +
        apiKey,
    )
    let respJson = await resp.json()
    if (!respJson || respJson.length < 1) {
      return
    }
    let points = Polyline.decode(respJson.routes[0]?.overview_polyline?.points)
    let coords = points.map((point, index) => {
      return {
        latitude: point[0],
        longitude: point[1],
      }
    })
    callback && callback(coords)
  } catch (error) {
    console.log(error)
  }
}

/*
 ** Returns (callback) the number of seconds a car needs to drive from start to end
 */
export const getETA = async (start, end, apiKey) => {
  const etaRequestURL =
    `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${start.latitude},${start.longitude}&destinations=${end.latitude}%2C${end.longitude}&key=` +
    apiKey

  return new Promise(async function (resolve, reject) {
    try {
      const matrix = await fetch(etaRequestURL, { method: 'GET' })
      const matrixJson = await matrix.json()
      console.log(JSON.stringify(matrixJson))
      const rows = matrixJson.rows
      if (!rows || rows.length < 1) {
        reject()
      }
      const elements = rows[0].elements
      if (!elements || elements.length < 1) {
        reject()
      }
      resolve(elements[0]?.duration?.value)
    } catch (error) {
      console.log(error)
      reject()
    }
  })
}
