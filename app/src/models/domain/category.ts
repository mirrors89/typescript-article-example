import {Table, Column, Model, HasMany, CreatedAt, UpdatedAt} from "sequelize-typescript";
import Article from "./article";

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

    @HasMany(() => Article)
    articles: Article[];
}