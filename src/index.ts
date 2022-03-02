import DataEmitterComponent, { DataContext } from './component';
import DataEmitter from './emitter';
import withData from './with-data';

interface IWithData<T = {}> {
	emitterData: T;
}

export {
	DataEmitter,
	DataEmitterComponent,
	DataContext as DataEmitterContext,
	withData,
	IWithData,
};
