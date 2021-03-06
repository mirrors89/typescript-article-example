import {Table, Column, Model, ForeignKey, BelongsTo, HasMany, CreatedAt, UpdatedAt} from "sequelize-typescript";
import Category from "./category";
import Comment from "./comment";

@Table
export default class Article extends Model<Article> {
    @Column
    title: string;

    @Column
    subject: string;

    @Column
    author: string;

    @CreatedAt
    cdate: Date;

    @UpdatedAt
    udate: Date;

    @ForeignKey(() => Category)
    @Column
    categoryId : number;

    @BelongsTo(() => Category)
    category: Category;

    @HasMany(() => Comment)
    comments: Comment[];

}