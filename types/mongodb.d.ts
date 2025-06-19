// Type definitions for MongoDB

declare module 'mongodb' {
  export interface ObjectId {
    _id: string;
    toHexString(): string;
    equals(other: ObjectId): boolean;
    getTimestamp(): Date;
    static createFromHexString(hexString: string): ObjectId;
    static createFromTime(time: number): ObjectId;
    static isValid(id: string | number | ObjectId): boolean;
  }

  export interface FindOptions {
    projection?: Record<string, number>;
    sort?: Record<string, 1 | -1>;
    limit?: number;
    skip?: number;
    // Add other find options as needed
  }

  export interface Collection<T = any> {
    find(query?: any, options?: FindOptions): FindCursor<T>;
    findOne(filter: any, options?: FindOptions): Promise<T | null>;
    insertOne(doc: any, options?: any): Promise<InsertOneResult>;
    updateOne(filter: any, update: any, options?: any): Promise<UpdateResult>;
    deleteOne(filter: any, options?: any): Promise<DeleteResult>;
    countDocuments(filter?: any, options?: any): Promise<number>;
    aggregate<T = any>(pipeline: any[], options?: any): AggregationCursor<T>;
  }

  export type SortDirection = 1 | -1 | 'asc' | 'desc';
  export type Sort = Record<string, SortDirection>;

  export interface FindCursor<T = any> {
    toArray(): Promise<T[]>;
    next(): Promise<T | null>;
    forEach(callback: (doc: T) => void): Promise<void>;
    sort(sort: Sort): FindCursor<T>;
    limit(limit: number): FindCursor<T>;
    skip(skip: number): FindCursor<T>;
    // Add other cursor methods as needed
  }

  export interface AggregationCursor<T = any> {
    toArray(): Promise<T[]>;
    next(): Promise<T | null>;
  }

  export interface InsertOneResult {
    acknowledged: boolean;
    insertedId: any;
  }

  export interface UpdateResult {
    acknowledged: boolean;
    matchedCount: number;
    modifiedCount: number;
    upsertedId: any;
    upsertedCount: number;
  }

  export interface DeleteResult {
    acknowledged: boolean;
    deletedCount: number;
  }

  export interface Db {
    collection<T = any>(name: string): Collection<T>;
    admin(): any;
  }

  export interface MongoClient {
    db(name?: string): Db;
    close(force?: boolean): Promise<void>;
  }

  export interface MongoClientOptions {
    useNewUrlParser?: boolean;
    useUnifiedTopology?: boolean;
    // Add other options as needed
  }

  export class MongoClient {
    constructor(uri: string, options?: MongoClientOptions);
    db(name?: string): Db;
    connect(): Promise<MongoClient>;
    close(force?: boolean): Promise<void>;
    // Add other MongoClient methods as needed
  }

  // Export as a value (for `import { MongoClient } from 'mongodb'`)
  export const MongoClient: {
    new(uri: string, options?: MongoClientOptions): MongoClient;
  };
  export const ObjectId: {
    new (id?: string | number | ObjectId): ObjectId;
    createFromHexString(hexString: string): ObjectId;
    createFromTime(time: number): ObjectId;
    isValid(id: string | number | ObjectId): boolean;
  };
}
