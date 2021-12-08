import moment from 'moment';

moment.locale('id');

const dateFormat = (date) => moment(date).format('LLL');

export default dateFormat;
