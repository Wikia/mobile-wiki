class BirthdateInput {
	el: HTMLElement;
	input: HTMLInputElement;

	constructor(el: HTMLElement, input: HTMLInputElement) {
		this.el = el;
		this.input = input;
	}

	public init(): void {
		alert('init');
		this.initFocus();
		this.initBlur();
		this.initAutoTab();
	}

	private initFocus(): void {
		this.input.addEventListener('focus', (() => {
			this.input.classList.add('hide');
			this.el.classList.remove('hide');
		}).bind(this));
	}

	private initBlur(): void {
		//this.input.addEventListener('blur', (() => {
		//	this.input.classList.remove('hide');
		//	this.el.classList.add('hide');
		//}).bind(this));
	}

	private initAutoTab(): void {
		Array.prototype.forEach.call(this.el.querySelectorAll('.auto-tab'), function (input: HTMLInputElement) {
			new AutoTab(input).init();
		});
	}
}
