import React from 'react';
import { Loader, SocketComponent } from 'reacting-squirrel';
import Emitter from './emitter';

interface IOptionalProps<T> {
	LoaderComponent: React.ReactNode;
	onData: (data: T) => void;
	onDataUpdate: (data: T) => void;
}

export interface IProps<T, E> extends Partial<IOptionalProps<T>> {
	children: (data: T, emitter: E) => JSX.Element;
	emitter: E;
}

interface IState<T> {
	data: T;
}

// tslint:disable-next-line: max-line-length
export default class EmitterDataComponent<T, E extends Emitter<T> = Emitter<T>, P extends IProps<T, E> = IProps<T, E>>
	extends SocketComponent<P, IState<T>> {

	public static defaultProps: IOptionalProps<any> = {
		LoaderComponent: null,
		onData: null,
		onDataUpdate: null,
	};

	public state: IState<T> = {
		data: this.props.emitter.get(),
	};

	public async componentDidMount(): Promise<void> {
		const { emitter, onData } = this.props;
		super.componentDidMount();
		emitter.addDataListener(this._data);
		let data = emitter.get();
		if (!data) {
			data = await emitter.load();
		}
		if (typeof onData === 'function') {
			onData(data);
		}
	}

	public componentWillUnmount(): void {
		const { emitter } = this.props;
		super.componentWillUnmount();
		emitter.removeDataListener(this._data);
	}

	public render(): JSX.Element | React.ReactNode {
		const { children, LoaderComponent, emitter } = this.props;
		const { data } = this.state;
		if (!data) {
			return LoaderComponent || <Loader loaded={false} block={false} size="small" />;
		}
		return children(data, emitter);
	}

	private _data = (e: Emitter<T>, data: T) => {
		const { onDataUpdate } = this.props;
		this.setState({ data });
		if (typeof onDataUpdate === 'function') {
			onDataUpdate(data);
		}
	}
}
