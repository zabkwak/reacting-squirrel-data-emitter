import { DataEmitter } from '../src';

interface IData {
	emitter: string;
}

export default class TestEmitter extends DataEmitter<IData> {

	private _key: string;

	constructor(key: string) {
		super();
		this._key = key;
	}

	protected _getDataEvent(): string {
		return this._key;
	}

	protected async _load(): Promise<any> {
		return { emitter: this._getDataEvent() };
	}

	protected _update(params: Partial<any>, id?: number | string): Promise<any> {
		return null;
	}
}
