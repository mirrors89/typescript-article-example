import {Table, Column, Model, CreatedAt, UpdatedAt} from "sequelize-typescript";

@Table
export default class Category extends Model<Category> {
    @Column
    name: string;

    @Column
    description: string;

    @CreatedAt
    cdate: Date;

    @UpdatedAt
    udate: Date;
}