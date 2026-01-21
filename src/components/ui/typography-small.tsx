import { PropsWithChildren } from 'react';

export const TypographySmall = ({ children }: PropsWithChildren) => (
  <small className='text-sm leading-none font-medium'>{children}</small>
);
