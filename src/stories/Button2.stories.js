// import { ButtonRound } from './Button2';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import '../../dist/assets/css/common.css';

const ButtonRound = ({ type, color, primary, size, label, onClick }) => {
    const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  
    return html`
			<button type="button" 
				class="btn-${type}-${color}"
			>
				${label}
			</button>
    `;
  };

// export const btn = () => htmlbutton;
  

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
export default {
  title: 'Button',
  tags: ['autodocs'],
  render: (args) => ButtonRound(args),
  argTypes: {
    // backgroundColor: { control: 'color' },
    // onClick: { action: 'onClick' },
		type: {
			control: { type: 'radio'},
			options: ['round', 'lined' ],
		},
		color: {
			control: {type: 'select'},
			options: ['primary', 'secondary', 'danger'],
		},
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/web-components/writing-stories/args
export const button = {
  args: {
    // primary: true,
		type: 'round',
		color: 'primary',
    label: 'Button',
		size: 'small',
  },
};
