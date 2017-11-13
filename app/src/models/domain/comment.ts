import {Table, Column, Model, ForeignKey, HasMany, BelongsTo,  CreatedAt, UpdatedAt} from "sequelize-typescript";
import Article from "./article";

@Table
export default class Comment extends Model<Comment> {
    @Column
    text: string;

    @Column
    author: string;

    @CreatedAt
    cdate: Date;

    @UpdatedAt
    udate: Date;

    @ForeignKey(() => Article)
    @Column
    articleId : number;

    @BelongsTo(() => Article)
    article: Article;

    @HasMany(()=> Comment)
    comments: Comment[];
    
    @ForeignKey(() => Comment)
    @Column
    parentId: number;

    @BelongsTo(() => Comment, {constraints: false})
    parent: Comment;
    

}