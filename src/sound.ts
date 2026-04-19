export function playTrashSound(): void {
  try {
    const ctx = new AudioContext();
    const t = ctx.currentTime;

    // 纸张摩擦噪声（bandpass，快速衰减）
    const noiseLen = Math.floor(ctx.sampleRate * 0.07);
    const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / noiseLen, 1.5);
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuf;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 1600;
    noiseFilter.Q.value = 1.2;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.38, t);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(t);

    // 低频撞击（稍作延迟，模拟落入垃圾桶）
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(190, t + 0.04);
    osc.frequency.exponentialRampToValueAtTime(58, t + 0.19);
    oscGain.gain.setValueAtTime(0, t);
    oscGain.gain.linearRampToValueAtTime(0.52, t + 0.04);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.19);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);

    setTimeout(() => ctx.close(), 600);
  } catch {
    // 静默失败（AudioContext 被策略拦截时）
  }
}
