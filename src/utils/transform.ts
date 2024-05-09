import { Commentator, ExportData } from '/@/types/commentator';

export function timeIndex2Info(num: number) {
	let time_index = num;
	let buf = {
		campus: '',
		weekday: '',
		session: '',
	};
	const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
	const sessions = ['8:00 ~ 9:30', '10:00 ~ 11:30', '14:00 ~ 15:30', '16:00 ~ 17:30'];
	buf.campus = time_index < 29 ? '学院路' : '沙河';
	time_index = time_index < 29 ? time_index : time_index - 28;
	buf.weekday = weekdays[Math.floor((time_index - 1) / 4)];
	buf.session = sessions[(time_index - 1) % 4];
	return buf;
}

export function info2TimeIndex(info: any) {
	let campus = info['campus'];
	let weekday = info['weekday'];
	let session = info['session'];
	let time_index = 0;
	if (campus === '沙河') {
		time_index += 28;
	}
	const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
	const sessions = ['8:00 ~ 9:30', '10:00 ~ 11:30', '14:00 ~ 15:30', '16:00 ~ 17:30'];
	time_index += weekdays.indexOf(weekday) * 4;
	time_index += sessions.indexOf(session) + 1;
	return time_index;
}

export function select2PostData(select: any) {
	const data = JSON.parse(JSON.stringify(select));
	let postData = [];
	for (let i = 0; i < data.length; i++) {
		postData.push(data[i][1]);
	}
	return postData;
}

export function getData2Show(commentators: Array<Commentator>) {
	let buf: Array<ExportData> = [];
	for (let i = 0; i < commentators.length; i++) {
		buf.push({
			...commentators[i],
			tag: commentators[i].tag == 1 ? '熟练' : '入门',
			...timeIndex2Info(commentators[i].time_index),
		});
	}
	return buf;
}

export function getBookingData2Show(bookingData: any) {
	let buf: Array<Recommend> = [];
	const icons = ['ele-Food', 'ele-ShoppingCart', 'ele-School', 'ele-AlarmClock'];
	const bgs = ['#48D18D', '#F95959', '#8595F4', '#FEBB50'];
	const iconColors = ['#64d89d', '#F86C6B', '#92A1F4', '#FDC566'];
	for (let i = 0; i < bookingData.length; i++) {
		buf.push({
			...bookingData[i],
			status: bookingData[i].status == 1 ? '已过期' : '未过期',
			week_num: '第' + bookingData[i].week_num + '周',
			commentator: bookingData[i].lecturer[0],
			...timeIndex2Info(bookingData[i].time_index),
			icon: icons[i % 4],
			bg: bgs[i % 4],
			iconColor: iconColors[i % 4],
		});
	}
	return buf;
}
