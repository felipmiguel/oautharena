import { Injectable } from '@angular/core';
import { Modals, Plugins } from '@capacitor/core';
import { AuthenticationOptions } from './authentication-options';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ConfigurationManagerService {
  constructor() { }

  async saveConfig(config: AuthenticationOptions) {
    let prompReturn = await Modals.prompt({
      title: "Guardar configuración",
      message: 'Nombre de la configuración'
    });
    if (prompReturn.cancelled == false) {
      config.name = prompReturn.value;
      await Storage.set({
        key: config.name,
        value: JSON.stringify(config)
      });
    }
  }

  async getAvailableConfigurations(): Promise<AuthenticationOptions[]> {
    let configIds = await Storage.keys();
    let results: AuthenticationOptions[] = [];
    configIds.keys.forEach(key => {
      if (key != 'current_config') {
        Storage.get({ key: key }).then(value => {
          let config: AuthenticationOptions = JSON.parse(value.value);
          results.push(config);
        });
      }
    });
    return results;
  }

  async saveCurrentConfiguration(configuration: AuthenticationOptions): Promise<void> {
    await Storage.set({
      key: 'current_config',
      value: JSON.stringify(configuration)
    });
  }

  async getCurrentConfiguration(): Promise<AuthenticationOptions> {
    const serializedConfig = await Storage.get({ key: 'current_config' });
    if (serializedConfig) {
      return JSON.parse(serializedConfig.value);
    } else {
      return null;
    }

  }


  async deleteConfig(name: string) {
    await Storage.remove({
      key: name
    });
  }
}
