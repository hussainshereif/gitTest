import { NullValuesConverterPipe } from './null-values-converter.pipe';

describe('NullValuesConverterPipe', () => {
  it('create an instance', () => {
    const pipe = new NullValuesConverterPipe();
    expect(pipe).toBeTruthy();
  });
});
