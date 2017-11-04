import DataSource from "../../config/data-source";
import {Sequelize} from "sequelize-typescript";
import Category from "../models/domain/category"

class DatabaseConfig {
  private _sequelize: Sequelize;
    
  constructor() {
    const sequelize: Sequelize = new Sequelize({
      ...new DataSource().getConfig
    });
    // 모델 추가
    sequelize.addModels([Category]);
    this._sequelize = sequelize;    
  }

  get getSequelize() {
    return this._sequelize;
  }
}

const database = new DatabaseConfig();
export const sequelize = database.getSequelize;