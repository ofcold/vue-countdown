export const props = {
	initStr: String,
	second: {
		default: 120,
		validator(val) {
			return /^\d*$/.test(val);
		}
	},
	tag: {
		type: String,
		default: 'a'
	},
	runStr: {
		type: String,
		default: '{%s} 秒后重新获取'
	},
	resetStr: {
		type: String,
		default: '重新获取手机短信验证码'
	},
	classes: {
		type: [Array, Object, String],
		default: ''
	},
	onstart: {
		type: Boolean,
		default: false
	},
	storageKey: {
		type: String
	},
	contentText: {
		type: String,
		default: '获取手机短信验证码'
	}
};
function clickHandlerFactory ({ disabled, tag, href, suppliedHandler, parent }) {
	const isRouterLink = tag === 'router-link'

	return function onClick (e) {
		if (disabled && e instanceof Event) {
			// Stop event from bubbling up.
			e.stopPropagation()
			// Kill the event loop attached to this specific EventTarget.
			e.stopImmediatePropagation()
		} else {
			parent.$root.$emit('clicked::link', e)

			if (isRouterLink && e.target.__vue__) {
				e.target.__vue__.$emit('click', e)
			}
			if (typeof suppliedHandler === 'function') {
				suppliedHandler(...arguments)
			}
		}

		if ((!isRouterLink && href === '#') || disabled) {
			// Stop scroll-to-top behavior or navigation.
			e.preventDefault()
		}
	}
}
export default {
	name: 'OfcoldCountDown',
	data: () => ({
		timer: null
	}),
	props,
	watch: {
		onstart(value) {
			value && this.run();
		}
	},
	methods: {
		run(lastSecond) {
			let second = lastSecond ? lastSecond : this.second;
			if (this.storageKey) {
				const runSecond = new Date().getTime() + second * 1000;
				window.sessionStorage.setItem(this.storageKey, runSecond);
			}
			if ( !lastSecond ) {
				this.contentText = this.getStr(second);
			}
			this.timer = setInterval(() => {
				second--;
				this.contentText = this.getStr(second);
				second <= 0 && this.stop();
			}, 1000);
		},
		stop() {
			this.contentText = this.resetStr;
			this.onstart = false;
			this.$emit('input', false);
			clearInterval(this.timer);
		},
		getStr(second) {
			return this.runStr.replace(/\{([^{]*?)%s(.*?)\}/g, second);
		}
	},
	created() {
		const lastSecond = ~~((window.sessionStorage.getItem(this.storageKey) - new Date().getTime()) / 1000);
		if ( lastSecond > 0 && this.storageKey ) {
			this.contentText = this.getStr(lastSecond);
			this.onstart = true;
			this.run(lastSecond);
		}
		else {
			if (this.initStr) this.contentText = this.initStr;
		}
		if (this.onstart) {
			this.run();
		}
	},
	destroyed() {
		!this.storageKey && this.stop();
	},
	render(h, {props, data, parent}) {
		const suppliedHandler = (data[eventType] || {}).click
		const handlers = { click: clickHandlerFactory({ props.tag, 'javascript:void(0)', disabled: props.onstart, suppliedHandler, parent }) }
		return h(
			props.tag,
			{
				class: props.classes,
				attrs: {
					rel: null,
					href: 'javascript:void(0)',
					tabindex: props.onstart ? '-1' : (data.attrs ? data.attrs.tabindex : null),
					'aria-disabled': (tag === 'a' && props.onstart) ? 'true' : null
				},
				props,
				on: handlers
			},
			props.contentText
		)
	}
}