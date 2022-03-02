import React from 'react';
import { DataContext } from './component';

// TODO check the typings

export default function withData<C extends typeof React.Component>(Component: C) {
	const CComponent = Component as typeof React.Component;
	return React
		.forwardRef<typeof Component, Omit<React.ComponentProps<typeof Component>, 'emitterData'>>(
			(props, ref) => {
				return (
					<DataContext.Consumer>
						{
							(data) => (
								<CComponent emitterData={data} {...props} />
							)
						}
					</DataContext.Consumer>
				);
			},
		);
}
