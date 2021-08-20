import * as moment from 'moment';

export const makeId = (length) => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

export const cleanAccents = (str: string): string => {
	if (typeof str === 'string') {
		str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
		str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
		str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
		str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
		str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
		str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
		str = str.replace(/đ/g, 'd');
		str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
		str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
		str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
		str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
		str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
		str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
		str = str.replace(/Đ/g, 'D');
		str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
		str = str.replace(/\u02C6|\u0306|\u031B/g, '');
		return str;
	}
	if (typeof str === 'number') {
		return String(str);
	}
};

export const renameUniqueFileName = (originalFile: File, newName: string) => {
	const flatName = `${cleanAccents(newName.replace(' ', '_'))}`;
	return new File([originalFile], flatName, {
		type: originalFile.type,
		lastModified: originalFile.lastModified
	});
};

export const convertDateToServer = (value: string) => {
	return value ? moment(value, 'DD/MM/YYYY').toISOString(false) : null;
};

export const convertDateToDisplay = (value: string) => {
	return value ? moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY').toString() : null;
};

export const formatMoney = (n) => {
	if (n !== '' && n >= 0) {
		return (Math.round(n * 100) / 100).toLocaleString().split('.').join(',');
	}
};

export const convertMoney = (value: string) => {
	if (value) {
		return Number(value.replace(/,/g, ''));
	}
	return null;
};
