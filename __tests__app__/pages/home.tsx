import React from 'react';
import { Page } from 'reacting-squirrel';
import { DataEmitterComponent, DataEmitterContext } from '../../src';
import TestComponent from '../component';
import TestEmitter from '../test-emitter';

interface IData {
	test: any;
	inner: any;
}

export default class HomePage extends Page {

	public render(): JSX.Element {
		return (
			<DataEmitterComponent
				emitter={new TestEmitter('test')}
			>
				<DataEmitterComponent
					emitter={new TestEmitter('inner')}
				>
					<div>
						<TestComponent
							test="test"
						/>
						<DataEmitterContext.Consumer>
							{
								(data: IData) => (
									<pre>{JSON.stringify(data, null, 4)}</pre>
								)
							}
						</DataEmitterContext.Consumer>
					</div>
				</DataEmitterComponent>
			</DataEmitterComponent>
		);
	}
}
