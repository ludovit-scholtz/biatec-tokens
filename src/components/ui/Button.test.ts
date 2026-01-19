import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from './Button.vue';

describe('Button Component', () => {
  it('should render with default props', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me',
      },
    });

    expect(wrapper.text()).toContain('Click me');
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('should emit click event when clicked', async () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me',
      },
    });

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')?.[0]).toBeTruthy();
  });

  it('should be disabled when disabled prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
      slots: {
        default: 'Click me',
      },
    });

    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });

  it('should show loading state', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
      slots: {
        default: 'Click me',
      },
    });

    expect(wrapper.find('.animate-spin').exists()).toBe(true);
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });

  it('should apply primary variant classes', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'primary',
      },
      slots: {
        default: 'Click me',
      },
    });

    expect(wrapper.find('button').classes()).toContain('from-blue-600');
  });

  it('should apply danger variant classes', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'danger',
      },
      slots: {
        default: 'Delete',
      },
    });

    expect(wrapper.find('button').classes()).toContain('bg-red-600');
  });

  it('should apply size classes correctly', () => {
    const wrapperSm = mount(Button, {
      props: {
        size: 'sm',
      },
      slots: {
        default: 'Small',
      },
    });

    const wrapperLg = mount(Button, {
      props: {
        size: 'lg',
      },
      slots: {
        default: 'Large',
      },
    });

    expect(wrapperSm.find('button').classes()).toContain('px-3');
    expect(wrapperLg.find('button').classes()).toContain('px-6');
  });

  it('should apply full width class when fullWidth is true', () => {
    const wrapper = mount(Button, {
      props: {
        fullWidth: true,
      },
      slots: {
        default: 'Full Width',
      },
    });

    expect(wrapper.find('button').classes()).toContain('w-full');
  });

  it('should render icon slot when provided', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'With Icon',
        icon: '<svg class="test-icon"></svg>',
      },
    });

    expect(wrapper.find('.test-icon').exists()).toBe(true);
  });

  it('should not render icon when loading', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
      slots: {
        default: 'Loading',
        icon: '<svg class="test-icon"></svg>',
      },
    });

    expect(wrapper.find('.test-icon').exists()).toBe(false);
    expect(wrapper.find('.animate-spin').exists()).toBe(true);
  });
});
