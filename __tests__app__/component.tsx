import React from 'react';
import { Component } from 'reacting-squirrel';
import { IWithData } from '../src';
import { DataContext } from '../src/component';
import withData from '../src/with-data';

interface IProps {
	test: string;
}

interface IData {
	test: any;
	inner: any;
}

class TestComponent extends Component<IProps & IWithData<IData>> {

	public render(): JSX.Element {
		return (
			<pre>{JSON.stringify(this.props, null, 4)}</pre>
		);
		/*
		return (
			<DataContext.Consumer>
				{
					(data: Record<string, any>) => (
						<pre>{JSON.stringify(data, null, 4)}</pre>
					)
				}
			</DataContext.Consumer>
		);
		*/
	}
}

export default withData(TestComponent);
