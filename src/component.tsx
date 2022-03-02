import React from 'react';
import { Loader, SocketComponent } from 'reacting-squirrel';
import Emitter from './emitter';

export interface IEmitterDataProps<T = any> {
	emitterData: T;
}

interface IOptionalProps<T, E> extends Partial<IEmitterDataProps> {
	LoaderComponent: React.ReactNode;
	onData: (data: T) => void;
	onDataUpdate: (data: T) => void;
	onError: (error: any) => void;
	renderError: (error: any, emitter: E) => JSX.Element;
}

export interface IProps<T, E> extends Partial<IOptionalProps<T, E>> {
	children: JSX.Element | JSX.Element[] | ((data: T, emitter: E) => JSX.Element);
	emitter: E;
}

interface IState<T> {
	data: T;
	error: any;
}

export const DataContext = React.createContext<Record<string, any>>({});

// tslint:disable-next-line: max-line-length
export default class EmitterDataComponent<T, E extends Emitter<T> = Emitter<T>, P extends IProps<T, E> = IProps<T, E>>
	extends SocketComponent<P, IState<T>> {

	public static defaultProps: IOptionalProps<any, any> = {
		LoaderComponent: null,
		onData: null,
		onDataUpdate: null,
		onError: null,
		renderError: null,
		emitterData: {},
	};

	private static _deprecatedShowed: boolean = false;

	public state: IState<T> = {
		data: this.props.emitter.get(),
		error: null,
	};

	public async componentDidMount(): Promise<void> {
		const { emitter, onData, onError } = this.props;
		super.componentDidMount();
		emitter.addDataListener(this._data);
		let data = emitter.get();
		if (!data) {
			try {
				data = await emitter.load();
			} catch (error) {
				if (typeof onError === 'function') {
					onError(error);
				}
				this.setState({ error });
				return;
			}
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
		const { children, LoaderComponent, emitter, renderError } = this.props;
		const { data, error } = this.state;
		if (error && typeof renderError === 'function') {
			return renderError(error, emitter);
		}
		if (!data) {
			return LoaderComponent || <Loader loaded={false} block={false} size="small" />;
		}
		if (React.isValidElement(children)) {
			return (
				<DataContext.Consumer>
					{
						(prevData) => (
							<DataContext.Provider value={{ ...prevData, [emitter.getKey()]: data }}>
								{children}
							</DataContext.Provider>
						)
					}
				</DataContext.Consumer>
			);
		}
		if (!EmitterDataComponent._deprecatedShowed) {
			this.getContext().logWarning('The children as function is deprecated.');
			EmitterDataComponent._deprecatedShowed = true;
		}
		if (typeof children !== 'function') {
			return null;
		}
		// @ts-ignore
		return children(data, emitter);
	}

	private _data = (e: Emitter<T>, data: T) => {
		const { onDataUpdate } = this.props;
		this.setState({ data, error: null });
		if (typeof onDataUpdate === 'function') {
			onDataUpdate(data);
		}
	}
}
