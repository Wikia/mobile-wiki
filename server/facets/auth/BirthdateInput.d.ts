interface DateEndian {
	big: string;
	little: string;
	middle: string;
}

interface InputData {
	name: string;
	maxLength: number;
	maxVal: number;
	placeholder: string;
}

interface DateElements {
	day: InputData;
	month: InputData;
	year: InputData;
}
