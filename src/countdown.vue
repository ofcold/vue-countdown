<template>
	<a href="javascript:void(0)" :disabled="start" class="btn btn-link" :class="classes">
		{{ content }}
	</a>
</template>

<script>
	export default {
		name: 'OfcoldCountdown',
		data: () => ({
			content: '获取手机短信验证码',
			timer: null,
			start: false
		}),
		props: {
			initStr: String,
			second: {
				default: 120,
				validator(val) {
					return /^\d*$/.test(val);
				}
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
			}
		},
		watch: {
			onstart(value) {
				this.start = value;
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
					this.content = this.getStr(second);
				}
				this.timer = setInterval(() => {
					second--;
					this.content = this.getStr(second);
					second <= 0 && this.stop();
				}, 1000);
			},
			stop() {
				this.content = this.resetStr;
				this.start = false;
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
				this.content = this.getStr(lastSecond);
				this.start = true;
				this.run(lastSecond);
			}
			else {
				if (this.initStr) this.content = this.initStr;
			}
			if ( this.onstart ) {
				this.start = this.onstart;
				this.run();
			}
		},
		destroyed() {
			!this.storageKey && this.stop();
		}
	}
</script>