# vue countdown
It is mainly used for the countdown of SMS verification code transmission.

## Installation
```bash
npm install ofcold-countdown --save
```

## Usage
```html
	<countdown :second="60" onstart :classes="[
		'btn', 'btn-info', 'btn-sm'
	]">
	</countdown>
```
```vue
import countdown from 'ofcold-countdown';

export default {
	components: {
		countdown
	}
}
```