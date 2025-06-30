import { Evaluation, Standard } from '@kaiyuanshe/openhackathon-service';
import { observable } from 'mobx';
import { persist, restore, toggle } from 'mobx-restful';

import { isServer } from '../../configuration';
import { TableModel } from '../Base';

export class EvaluationModel extends TableModel<Evaluation> {
  baseURI = '';

  constructor(activityName: string, teamId: number) {
    super();
    this.baseURI = `hackathon/${activityName}/team/${teamId}/evaluation`;
  }

  @persist()
  @observable
  accessor currentStandard = {} as Standard;

  restored = !isServer() && restore(this, 'Evaluation');

  @toggle('downloading')
  async getStandard() {
    await this.restored;

    if (this.currentStandard) return this.currentStandard;

    const { body } = await this.client.get<Standard>(`${this.baseURI}/../../standard`);

    return (this.currentStandard = body!);
  }
}
