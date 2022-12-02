export const getAddressFromLocation = location => {
  if (location.results && location.results.length > 0) {
    const address = location.results[0].address_components
    const obj = {
      locality:
        address.filter(el => el.types.includes('locality'))[0]?.long_name || '',
      administrative_area_level_1:
        address.filter(el =>
          el.types.includes('administrative_area_level_1'),
        )[0]?.long_name || '',
    }
    return `${obj.locality}, ${obj.administrative_area_level_1}`
  } else {
    return ' '
  }
}
