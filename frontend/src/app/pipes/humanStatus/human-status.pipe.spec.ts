import { HumanStatusPipe } from './human-status.pipe';

describe('HumanStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new HumanStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
