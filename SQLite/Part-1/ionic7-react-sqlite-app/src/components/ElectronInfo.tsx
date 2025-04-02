import React, { useEffect, useState } from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel } from '@ionic/react';

// 扩展 Window 接口以包含 electron API
declare global {
  interface Window {
    ipcRenderer: any;
    electron: {
      process: {
        versions: {
          node: string;
          electron: string;
          chrome: string;
        }
      }
    };
  }
}

const ElectronInfo: React.FC = () => {
  const [isElectron, setIsElectron] = useState(false);
  const [electronVersion, setElectronVersion] = useState<string | null>(null);
  const [chromeVersion, setChromeVersion] = useState<string | null>(null);
  const [nodeVersion, setNodeVersion] = useState<string | null>(null);

  useEffect(() => {
    // 检查是否在 Electron 中运行
    if (window.navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {
      setIsElectron(true);
      
      // 获取 Electron 版本
      const userAgent = window.navigator.userAgent;
      const electronRegex = /electron\/(\S+)/i;
      const electronMatch = userAgent.match(electronRegex);
      if (electronMatch && electronMatch[1]) {
        setElectronVersion(electronMatch[1]);
      }
      
      // 获取 Chrome 版本
      const chromeRegex = /chrome\/(\S+)/i;
      const chromeMatch = userAgent.match(chromeRegex);
      if (chromeMatch && chromeMatch[1]) {
        setChromeVersion(chromeMatch[1]);
      }
      
      // 尝试通过 contextBridge 获取 Node.js 版本
      if (window.electron && window.electron.process && window.electron.process.versions) {
        setNodeVersion(window.electron.process.versions.node);
      }
    }
  }, []);

  if (!isElectron) {
    return null;
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Electron 集成</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonItem>
          <IonLabel>在 Electron 中运行: {isElectron ? '是' : '否'}</IonLabel>
        </IonItem>
        {electronVersion && (
          <IonItem>
            <IonLabel>Electron 版本: {electronVersion}</IonLabel>
          </IonItem>
        )}
        {chromeVersion && (
          <IonItem>
            <IonLabel>Chrome 版本: {chromeVersion}</IonLabel>
          </IonItem>
        )}
        {nodeVersion && (
          <IonItem>
            <IonLabel>Node.js 版本: {nodeVersion}</IonLabel>
          </IonItem>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default ElectronInfo;
