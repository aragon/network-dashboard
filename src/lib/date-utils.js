import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

export const toMs = (seconds) => seconds * 1000

const KNOWN_FORMATS = {
  iso: 'YYYY-MM-DDTHH:mm:ssZ',
  onlyDate: 'YYYY-MM-DD',
  standard: 'YYYY-MM-DD h:mm A',
}

// dayjs plugins
dayjs.extend(isBetween)
dayjs.extend(relativeTime)
dayjs.extend(utc)

function dateFormat(date, format) {
  return dayjs(date).format(KNOWN_FORMATS[format] || format)
}

export { dayjs, dateFormat }
