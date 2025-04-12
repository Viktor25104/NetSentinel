import { CleanCpuNamePipe } from './clean-cpu-name.pipe';

describe('CleanCpuNamePipe', () => {
  it('create an instance', () => {
    const pipe = new CleanCpuNamePipe();
    expect(pipe).toBeTruthy();
  });
});
