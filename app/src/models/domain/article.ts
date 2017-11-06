import {Table, Column, Model, CreatedAt, UpdatedAt} from "sequelize-typescript";

@Table
export default class Article extends Model<Article> {
    @Column
    title: string;

    @Column
    subject: string;

    @CreatedAt
    cdate: Date;

    @UpdatedAt
    udate: Date;
}