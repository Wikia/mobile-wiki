class BirthdateInput {
	input: HTMLInputElement;

	constructor(input: HTMLElement) {
		this.input = <HTMLInputElement> input;
	}

	init(): void {
		this.initAutoTab();
	}

	// TODO: possibly pull this out into a separate plugin
	initAutoTab(): void {
		//if (original.getAttribute&&original.value.length==original.getAttribute("maxlength"))
		//	destination.focus()
	}

}
