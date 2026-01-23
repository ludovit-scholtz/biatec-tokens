import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HelloWorld from './HelloWorld.vue';

describe('HelloWorld Component', () => {
  it('should render message prop', () => {
    const msg = 'Hello Biatec Tokens';
    const wrapper = mount(HelloWorld, {
      props: {
        msg,
      },
    });

    expect(wrapper.text()).toContain(msg);
    expect(wrapper.find('h1').text()).toBe(msg);
  });

  it('should initialize count to 0', () => {
    const wrapper = mount(HelloWorld, {
      props: {
        msg: 'Test',
      },
    });

    expect(wrapper.find('button').text()).toContain('count is 0');
  });

  it('should increment count when button is clicked', async () => {
    const wrapper = mount(HelloWorld, {
      props: {
        msg: 'Test',
      },
    });

    const button = wrapper.find('button');
    
    await button.trigger('click');
    expect(button.text()).toContain('count is 1');

    await button.trigger('click');
    expect(button.text()).toContain('count is 2');
  });

  it('should render all required links', () => {
    const wrapper = mount(HelloWorld, {
      props: {
        msg: 'Test',
      },
    });

    const links = wrapper.findAll('a');
    expect(links.length).toBeGreaterThan(0);
  });
});
