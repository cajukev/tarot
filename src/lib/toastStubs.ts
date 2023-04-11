import { toast } from '@zerodevx/svelte-toast';

export const achievement = (m:string, options?: object) => toast.push(m, {
  ...options,
  theme: {
    '--toastBackground': '#F7DB5D;'
  }
});

export const unlock = (m:string, options?: object) => toast.push(m, {
  ...options,
  initial: 0,
  theme: {
    '--toastBackground': '#88ADF6;'
  }
});

export const secret = (m:string, options?: object) => toast.push(m, {
  ...options,
  initial: 0,
  theme: {
    '--toastBackground': '#5DF76C;'
  }
});


