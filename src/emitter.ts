import { SocketRequest } from 'reacting-squirrel';

export default abstract class DataEmitter<T> extends SocketRequest {

	protected _data: T;

	private _loading: boolean = false;

	public addDataListener(listener: (self: this, data: T) => void): this {
		this.addListener(this._getDataEvent(), listener);
		return this;
	}

	public removeDataListener(listener: (self: this, data: T) => void): this {
		this.removeListener(this._getDataEvent(), listener);
		return this;
	}

	public clearData(): void {
		this._data = null;
		this._loading = false;
	}

	public async load(): Promise<T> {
		if (this._loading) {
			return null;
		}
		this._loading = true;
		let data: T;
		try {
			data = await this._load();
		} catch (e) {
			this._loading = false;
			throw e;
		}
		this._loading = false;
		this._data = data;
		this._callDataEvent();
		return data;
	}

	public async update(params: Partial<T>, id?: number | string): Promise<T> {
		const data = await this._update(params, id);
		this._data = data;
		this._callDataEvent();
		return data;
	}

	public get(): T {
		return this._data;
	}

	public async getAsync(): Promise<T> {
		while (!this._data) {
			await this._wait(10);
		}
		return this._data;
	}

	public getKey(): string {
		return this._getDataEvent();
	}

	protected _callDataEvent(): void {
		this._callListener(this._getDataEvent(), this._data);
	}

	protected abstract _getDataEvent(): string;

	protected abstract _load(): Promise<T>;

	protected abstract _update(params: Partial<T>, id?: number | string): Promise<T>;

	protected _wait(timeout: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, timeout);
		});
	}

	protected async _checkData(): Promise<void> {
		if (!this._data) {
			this._data = await this._load();
		}
	}
}
