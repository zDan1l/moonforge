/**
 * Client
 **/

import * as runtime from "./runtime/client.js";
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;
/**
 * Model Project
 *
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>;
/**
 * Model ProjectVersion
 *
 */
export type ProjectVersion =
	$Result.DefaultSelection<Prisma.$ProjectVersionPayload>;
/**
 * Model ProjectFile
 *
 */
export type ProjectFile = $Result.DefaultSelection<Prisma.$ProjectFilePayload>;
/**
 * Model ChatMessage
 *
 */
export type ChatMessage = $Result.DefaultSelection<Prisma.$ChatMessagePayload>;

/**
 * Enums
 */
export namespace $Enums {
	export const ProjectStatus: {
		DRAFT: "DRAFT";
		GENERATED: "GENERATED";
		REFINED: "REFINED";
	};

	export type ProjectStatus =
		(typeof ProjectStatus)[keyof typeof ProjectStatus];

	export const FileSource: {
		TEMPLATE: "TEMPLATE";
		AI_GENERATED: "AI_GENERATED";
		MODIFIED: "MODIFIED";
	};

	export type FileSource = (typeof FileSource)[keyof typeof FileSource];

	export const MessageRole: {
		USER: "USER";
		ASSISTANT: "ASSISTANT";
	};

	export type MessageRole = (typeof MessageRole)[keyof typeof MessageRole];
}

export type ProjectStatus = $Enums.ProjectStatus;

export const ProjectStatus: typeof $Enums.ProjectStatus;

export type FileSource = $Enums.FileSource;

export const FileSource: typeof $Enums.FileSource;

export type MessageRole = $Enums.MessageRole;

export const MessageRole: typeof $Enums.MessageRole;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
	ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
	const U = "log" extends keyof ClientOptions
		? ClientOptions["log"] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
			? Prisma.GetEvents<ClientOptions["log"]>
			: never
		: never,
	ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
	[K: symbol]: { types: Prisma.TypeMap<ExtArgs>["other"] };

	/**
	 * ##  Prisma Client ʲˢ
	 *
	 * Type-safe database client for TypeScript & Node.js
	 * @example
	 * ```
	 * const prisma = new PrismaClient({
	 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
	 * })
	 * // Fetch zero or more Users
	 * const users = await prisma.user.findMany()
	 * ```
	 *
	 *
	 * Read more in our [docs](https://pris.ly/d/client).
	 */

	constructor(
		optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>,
	);
	$on<V extends U>(
		eventType: V,
		callback: (
			event: V extends "query" ? Prisma.QueryEvent : Prisma.LogEvent,
		) => void,
	): PrismaClient;

	/**
	 * Connect with the database
	 */
	$connect(): $Utils.JsPromise<void>;

	/**
	 * Disconnect from the database
	 */
	$disconnect(): $Utils.JsPromise<void>;

	/**
	 * Executes a prepared raw query and returns the number of affected rows.
	 * @example
	 * ```
	 * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
	 * ```
	 *
	 * Read more in our [docs](https://pris.ly/d/raw-queries).
	 */
	$executeRaw<_T = unknown>(
		query: TemplateStringsArray | Prisma.Sql,
		...values: any[]
	): Prisma.PrismaPromise<number>;

	/**
	 * Executes a raw query and returns the number of affected rows.
	 * Susceptible to SQL injections, see documentation.
	 * @example
	 * ```
	 * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
	 * ```
	 *
	 * Read more in our [docs](https://pris.ly/d/raw-queries).
	 */
	$executeRawUnsafe<_T = unknown>(
		query: string,
		...values: any[]
	): Prisma.PrismaPromise<number>;

	/**
	 * Performs a prepared raw query and returns the `SELECT` data.
	 * @example
	 * ```
	 * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
	 * ```
	 *
	 * Read more in our [docs](https://pris.ly/d/raw-queries).
	 */
	$queryRaw<T = unknown>(
		query: TemplateStringsArray | Prisma.Sql,
		...values: any[]
	): Prisma.PrismaPromise<T>;

	/**
	 * Performs a raw query and returns the `SELECT` data.
	 * Susceptible to SQL injections, see documentation.
	 * @example
	 * ```
	 * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
	 * ```
	 *
	 * Read more in our [docs](https://pris.ly/d/raw-queries).
	 */
	$queryRawUnsafe<T = unknown>(
		query: string,
		...values: any[]
	): Prisma.PrismaPromise<T>;

	/**
	 * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
	 * @example
	 * ```
	 * const [george, bob, alice] = await prisma.$transaction([
	 *   prisma.user.create({ data: { name: 'George' } }),
	 *   prisma.user.create({ data: { name: 'Bob' } }),
	 *   prisma.user.create({ data: { name: 'Alice' } }),
	 * ])
	 * ```
	 *
	 * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
	 */
	$transaction<P extends Prisma.PrismaPromise<any>[]>(
		arg: [...P],
		options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
	): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

	$transaction<R>(
		fn: (
			prisma: Omit<PrismaClient, runtime.ITXClientDenyList>,
		) => $Utils.JsPromise<R>,
		options?: {
			maxWait?: number;
			timeout?: number;
			isolationLevel?: Prisma.TransactionIsolationLevel;
		},
	): $Utils.JsPromise<R>;

	$extends: $Extensions.ExtendsHook<
		"extends",
		Prisma.TypeMapCb<ClientOptions>,
		ExtArgs,
		$Utils.Call<
			Prisma.TypeMapCb<ClientOptions>,
			{
				extArgs: ExtArgs;
			}
		>
	>;

	/**
	 * `prisma.user`: Exposes CRUD operations for the **User** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more Users
	 * const users = await prisma.user.findMany()
	 * ```
	 */
	get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

	/**
	 * `prisma.project`: Exposes CRUD operations for the **Project** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more Projects
	 * const projects = await prisma.project.findMany()
	 * ```
	 */
	get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

	/**
	 * `prisma.projectVersion`: Exposes CRUD operations for the **ProjectVersion** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more ProjectVersions
	 * const projectVersions = await prisma.projectVersion.findMany()
	 * ```
	 */
	get projectVersion(): Prisma.ProjectVersionDelegate<ExtArgs, ClientOptions>;

	/**
	 * `prisma.projectFile`: Exposes CRUD operations for the **ProjectFile** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more ProjectFiles
	 * const projectFiles = await prisma.projectFile.findMany()
	 * ```
	 */
	get projectFile(): Prisma.ProjectFileDelegate<ExtArgs, ClientOptions>;

	/**
	 * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more ChatMessages
	 * const chatMessages = await prisma.chatMessage.findMany()
	 * ```
	 */
	get chatMessage(): Prisma.ChatMessageDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
	export import DMMF = runtime.DMMF;

	export type PrismaPromise<T> = $Public.PrismaPromise<T>;

	/**
	 * Validator
	 */
	export import validator = runtime.Public.validator;

	/**
	 * Prisma Errors
	 */
	export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
	export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
	export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
	export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
	export import PrismaClientValidationError = runtime.PrismaClientValidationError;

	/**
	 * Re-export of sql-template-tag
	 */
	export import sql = runtime.sqltag;
	export import empty = runtime.empty;
	export import join = runtime.join;
	export import raw = runtime.raw;
	export import Sql = runtime.Sql;

	/**
	 * Decimal.js
	 */
	export import Decimal = runtime.Decimal;

	export type DecimalJsLike = runtime.DecimalJsLike;

	/**
	 * Extensions
	 */
	export import Extension = $Extensions.UserArgs;
	export import getExtensionContext = runtime.Extensions.getExtensionContext;
	export import Args = $Public.Args;
	export import Payload = $Public.Payload;
	export import Result = $Public.Result;
	export import Exact = $Public.Exact;

	/**
	 * Prisma Client JS version: 7.7.0
	 * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
	 */
	export type PrismaVersion = {
		client: string;
		engine: string;
	};

	export const prismaVersion: PrismaVersion;

	/**
	 * Utility Types
	 */

	export import Bytes = runtime.Bytes;
	export import JsonObject = runtime.JsonObject;
	export import JsonArray = runtime.JsonArray;
	export import JsonValue = runtime.JsonValue;
	export import InputJsonObject = runtime.InputJsonObject;
	export import InputJsonArray = runtime.InputJsonArray;
	export import InputJsonValue = runtime.InputJsonValue;

	/**
	 * Types of the values used to represent different kinds of `null` values when working with JSON fields.
	 *
	 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
	 */
	namespace NullTypes {
		/**
		 * Type of `Prisma.DbNull`.
		 *
		 * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
		 *
		 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
		 */
		class DbNull {
			private DbNull: never;
			private constructor();
		}

		/**
		 * Type of `Prisma.JsonNull`.
		 *
		 * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
		 *
		 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
		 */
		class JsonNull {
			private JsonNull: never;
			private constructor();
		}

		/**
		 * Type of `Prisma.AnyNull`.
		 *
		 * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
		 *
		 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
		 */
		class AnyNull {
			private AnyNull: never;
			private constructor();
		}
	}

	/**
	 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
	 *
	 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
	 */
	export const DbNull: NullTypes.DbNull;

	/**
	 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
	 *
	 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
	 */
	export const JsonNull: NullTypes.JsonNull;

	/**
	 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
	 *
	 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
	 */
	export const AnyNull: NullTypes.AnyNull;

	type SelectAndInclude = {
		select: any;
		include: any;
	};

	type SelectAndOmit = {
		select: any;
		omit: any;
	};

	/**
	 * Get the type of the value, that the Promise holds.
	 */
	export type PromiseType<T extends PromiseLike<any>> =
		T extends PromiseLike<infer U> ? U : T;

	/**
	 * Get the return type of a function which returns a Promise.
	 */
	export type PromiseReturnType<
		T extends (...args: any) => $Utils.JsPromise<any>,
	> = PromiseType<ReturnType<T>>;

	/**
	 * From T, pick a set of properties whose keys are in the union K
	 */
	type Prisma__Pick<T, K extends keyof T> = {
		[P in K]: T[P];
	};

	export type Enumerable<T> = T | Array<T>;

	export type RequiredKeys<T> = {
		[K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
	}[keyof T];

	export type TruthyKeys<T> = keyof {
		[K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
	};

	export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

	/**
	 * Subset
	 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
	 */
	export type Subset<T, U> = {
		[key in keyof T]: key extends keyof U ? T[key] : never;
	};

	/**
	 * SelectSubset
	 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
	 * Additionally, it validates, if both select and include are present. If the case, it errors.
	 */
	export type SelectSubset<T, U> = {
		[key in keyof T]: key extends keyof U ? T[key] : never;
	} & (T extends SelectAndInclude
		? "Please either choose `select` or `include`."
		: T extends SelectAndOmit
			? "Please either choose `select` or `omit`."
			: {});

	/**
	 * Subset + Intersection
	 * @desc From `T` pick properties that exist in `U` and intersect `K`
	 */
	export type SubsetIntersection<T, U, K> = {
		[key in keyof T]: key extends keyof U ? T[key] : never;
	} & K;

	type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

	/**
	 * XOR is needed to have a real mutually exclusive union type
	 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
	 */
	type XOR<T, U> = T extends object
		? U extends object
			? (Without<T, U> & U) | (Without<U, T> & T)
			: U
		: T;

	/**
	 * Is T a Record?
	 */
	type IsObject<T> =
		T extends Array<any>
			? False
			: T extends Date
				? False
				: T extends Uint8Array
					? False
					: T extends bigint
						? False
						: T extends object
							? True
							: False;

	/**
	 * If it's T[], return T
	 */
	export type UnEnumerate<T> = T extends Array<infer U> ? U : T;

	/**
	 * From ts-toolbelt
	 */

	type __Either<O extends object, K extends Key> = Omit<O, K> &
		{
			// Merge all but K
			[P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
		}[K];

	type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

	type EitherLoose<O extends object, K extends Key> = ComputeRaw<
		__Either<O, K>
	>;

	type _Either<O extends object, K extends Key, strict extends Boolean> = {
		1: EitherStrict<O, K>;
		0: EitherLoose<O, K>;
	}[strict];

	type Either<
		O extends object,
		K extends Key,
		strict extends Boolean = 1,
	> = O extends unknown ? _Either<O, K, strict> : never;

	export type Union = any;

	type PatchUndefined<O extends object, O1 extends object> = {
		[K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
	} & {};

	/** Helper Types for "Merge" **/
	export type IntersectOf<U extends Union> = (
		U extends unknown
			? (k: U) => void
			: never
	) extends (k: infer I) => void
		? I
		: never;

	export type Overwrite<O extends object, O1 extends object> = {
		[K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
	} & {};

	type _Merge<U extends object> = IntersectOf<
		Overwrite<
			U,
			{
				[K in keyof U]-?: At<U, K>;
			}
		>
	>;

	type Key = string | number | symbol;
	type AtBasic<O extends object, K extends Key> = K extends keyof O
		? O[K]
		: never;
	type AtStrict<O extends object, K extends Key> = O[K & keyof O];
	type AtLoose<O extends object, K extends Key> = O extends unknown
		? AtStrict<O, K>
		: never;
	export type At<
		O extends object,
		K extends Key,
		strict extends Boolean = 1,
	> = {
		1: AtStrict<O, K>;
		0: AtLoose<O, K>;
	}[strict];

	export type ComputeRaw<A> = A extends Function
		? A
		: {
				[K in keyof A]: A[K];
			} & {};

	export type OptionalFlat<O> = {
		[K in keyof O]?: O[K];
	} & {};

	type _Record<K extends keyof any, T> = {
		[P in K]: T;
	};

	// cause typescript not to expand types and preserve names
	type NoExpand<T> = T extends unknown ? T : never;

	// this type assumes the passed object is entirely optional
	type AtLeast<O extends object, K extends string> = NoExpand<
		O extends unknown
			?
					| (K extends keyof O ? { [P in K]: O[P] } & O : O)
					| ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
			: never
	>;

	type _Strict<U, _U = U> = U extends unknown
		? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
		: never;

	export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
	/** End Helper Types for "Merge" **/

	export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

	/**
  A [[Boolean]]
  */
	export type Boolean = True | False;

	// /**
	// 1
	// */
	export type True = 1;

	/**
  0
  */
	export type False = 0;

	export type Not<B extends Boolean> = {
		0: 1;
		1: 0;
	}[B];

	export type Extends<A1, A2> = [A1] extends [never]
		? 0 // anything `never` is false
		: A1 extends A2
			? 1
			: 0;

	export type Has<U extends Union, U1 extends Union> = Not<
		Extends<Exclude<U1, U>, U1>
	>;

	export type Or<B1 extends Boolean, B2 extends Boolean> = {
		0: {
			0: 0;
			1: 1;
		};
		1: {
			0: 1;
			1: 1;
		};
	}[B1][B2];

	export type Keys<U extends Union> = U extends unknown ? keyof U : never;

	type Cast<A, B> = A extends B ? A : B;

	export const type: unique symbol;

	/**
	 * Used by group by
	 */

	export type GetScalarType<T, O> = O extends object
		? {
				[P in keyof T]: P extends keyof O ? O[P] : never;
			}
		: never;

	type FieldPaths<
		T,
		U = Omit<T, "_avg" | "_sum" | "_count" | "_min" | "_max">,
	> = IsObject<T> extends True ? U : T;

	type GetHavingFields<T> = {
		[K in keyof T]: Or<
			Or<Extends<"OR", K>, Extends<"AND", K>>,
			Extends<"NOT", K>
		> extends True
			? // infer is only needed to not hit TS limit
				// based on the brilliant idea of Pierre-Antoine Mills
				// https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
				T[K] extends infer TK
				? GetHavingFields<
						UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never
					>
				: never
			: {} extends FieldPaths<T[K]>
				? never
				: K;
	}[keyof T];

	/**
	 * Convert tuple to union
	 */
	type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
	type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
	type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

	/**
	 * Like `Pick`, but additionally can also accept an array of keys
	 */
	type PickEnumerable<
		T,
		K extends Enumerable<keyof T> | keyof T,
	> = Prisma__Pick<T, MaybeTupleToUnion<K>>;

	/**
	 * Exclude all keys with underscores
	 */
	type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
		? never
		: T;

	export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

	type FieldRefInputType<Model, FieldType> = Model extends never
		? never
		: FieldRef<Model, FieldType>;

	export const ModelName: {
		User: "User";
		Project: "Project";
		ProjectVersion: "ProjectVersion";
		ProjectFile: "ProjectFile";
		ChatMessage: "ChatMessage";
	};

	export type ModelName = (typeof ModelName)[keyof typeof ModelName];

	interface TypeMapCb<ClientOptions = {}>
		extends $Utils.Fn<
			{ extArgs: $Extensions.InternalArgs },
			$Utils.Record<string, any>
		> {
		returns: Prisma.TypeMap<
			this["params"]["extArgs"],
			ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
		>;
	}

	export type TypeMap<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> = {
		globalOmitOptions: {
			omit: GlobalOmitOptions;
		};
		meta: {
			modelProps:
				| "user"
				| "project"
				| "projectVersion"
				| "projectFile"
				| "chatMessage";
			txIsolationLevel: Prisma.TransactionIsolationLevel;
		};
		model: {
			User: {
				payload: Prisma.$UserPayload<ExtArgs>;
				fields: Prisma.UserFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.UserFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>;
					};
					findFirst: {
						args: Prisma.UserFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>;
					};
					findMany: {
						args: Prisma.UserFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
					};
					create: {
						args: Prisma.UserCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>;
					};
					createMany: {
						args: Prisma.UserCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
					};
					delete: {
						args: Prisma.UserDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>;
					};
					update: {
						args: Prisma.UserUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>;
					};
					deleteMany: {
						args: Prisma.UserDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.UserUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
					};
					upsert: {
						args: Prisma.UserUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>;
					};
					aggregate: {
						args: Prisma.UserAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateUser>;
					};
					groupBy: {
						args: Prisma.UserGroupByArgs<ExtArgs>;
						result: $Utils.Optional<UserGroupByOutputType>[];
					};
					count: {
						args: Prisma.UserCountArgs<ExtArgs>;
						result: $Utils.Optional<UserCountAggregateOutputType> | number;
					};
				};
			};
			Project: {
				payload: Prisma.$ProjectPayload<ExtArgs>;
				fields: Prisma.ProjectFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.ProjectFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectPayload>;
					};
					findFirst: {
						args: Prisma.ProjectFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectPayload>;
					};
					findMany: {
						args: Prisma.ProjectFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[];
					};
					create: {
						args: Prisma.ProjectCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectPayload>;
					};
					createMany: {
						args: Prisma.ProjectCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[];
					};
					delete: {
						args: Prisma.ProjectDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectPayload>;
					};
					update: {
						args: Prisma.ProjectUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectPayload>;
					};
					deleteMany: {
						args: Prisma.ProjectDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.ProjectUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[];
					};
					upsert: {
						args: Prisma.ProjectUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectPayload>;
					};
					aggregate: {
						args: Prisma.ProjectAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateProject>;
					};
					groupBy: {
						args: Prisma.ProjectGroupByArgs<ExtArgs>;
						result: $Utils.Optional<ProjectGroupByOutputType>[];
					};
					count: {
						args: Prisma.ProjectCountArgs<ExtArgs>;
						result: $Utils.Optional<ProjectCountAggregateOutputType> | number;
					};
				};
			};
			ProjectVersion: {
				payload: Prisma.$ProjectVersionPayload<ExtArgs>;
				fields: Prisma.ProjectVersionFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.ProjectVersionFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectVersionPayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.ProjectVersionFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectVersionPayload>;
					};
					findFirst: {
						args: Prisma.ProjectVersionFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectVersionPayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.ProjectVersionFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectVersionPayload>;
					};
					findMany: {
						args: Prisma.ProjectVersionFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectVersionPayload>[];
					};
					create: {
						args: Prisma.ProjectVersionCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectVersionPayload>;
					};
					createMany: {
						args: Prisma.ProjectVersionCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.ProjectVersionCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectVersionPayload>[];
					};
					delete: {
						args: Prisma.ProjectVersionDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectVersionPayload>;
					};
					update: {
						args: Prisma.ProjectVersionUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectVersionPayload>;
					};
					deleteMany: {
						args: Prisma.ProjectVersionDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.ProjectVersionUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.ProjectVersionUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectVersionPayload>[];
					};
					upsert: {
						args: Prisma.ProjectVersionUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectVersionPayload>;
					};
					aggregate: {
						args: Prisma.ProjectVersionAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateProjectVersion>;
					};
					groupBy: {
						args: Prisma.ProjectVersionGroupByArgs<ExtArgs>;
						result: $Utils.Optional<ProjectVersionGroupByOutputType>[];
					};
					count: {
						args: Prisma.ProjectVersionCountArgs<ExtArgs>;
						result:
							| $Utils.Optional<ProjectVersionCountAggregateOutputType>
							| number;
					};
				};
			};
			ProjectFile: {
				payload: Prisma.$ProjectFilePayload<ExtArgs>;
				fields: Prisma.ProjectFileFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.ProjectFileFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.ProjectFileFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>;
					};
					findFirst: {
						args: Prisma.ProjectFileFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.ProjectFileFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>;
					};
					findMany: {
						args: Prisma.ProjectFileFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[];
					};
					create: {
						args: Prisma.ProjectFileCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>;
					};
					createMany: {
						args: Prisma.ProjectFileCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.ProjectFileCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[];
					};
					delete: {
						args: Prisma.ProjectFileDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>;
					};
					update: {
						args: Prisma.ProjectFileUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>;
					};
					deleteMany: {
						args: Prisma.ProjectFileDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.ProjectFileUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.ProjectFileUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[];
					};
					upsert: {
						args: Prisma.ProjectFileUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>;
					};
					aggregate: {
						args: Prisma.ProjectFileAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateProjectFile>;
					};
					groupBy: {
						args: Prisma.ProjectFileGroupByArgs<ExtArgs>;
						result: $Utils.Optional<ProjectFileGroupByOutputType>[];
					};
					count: {
						args: Prisma.ProjectFileCountArgs<ExtArgs>;
						result:
							| $Utils.Optional<ProjectFileCountAggregateOutputType>
							| number;
					};
				};
			};
			ChatMessage: {
				payload: Prisma.$ChatMessagePayload<ExtArgs>;
				fields: Prisma.ChatMessageFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.ChatMessageFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.ChatMessageFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>;
					};
					findFirst: {
						args: Prisma.ChatMessageFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.ChatMessageFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>;
					};
					findMany: {
						args: Prisma.ChatMessageFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[];
					};
					create: {
						args: Prisma.ChatMessageCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>;
					};
					createMany: {
						args: Prisma.ChatMessageCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.ChatMessageCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[];
					};
					delete: {
						args: Prisma.ChatMessageDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>;
					};
					update: {
						args: Prisma.ChatMessageUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>;
					};
					deleteMany: {
						args: Prisma.ChatMessageDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.ChatMessageUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.ChatMessageUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[];
					};
					upsert: {
						args: Prisma.ChatMessageUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>;
					};
					aggregate: {
						args: Prisma.ChatMessageAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateChatMessage>;
					};
					groupBy: {
						args: Prisma.ChatMessageGroupByArgs<ExtArgs>;
						result: $Utils.Optional<ChatMessageGroupByOutputType>[];
					};
					count: {
						args: Prisma.ChatMessageCountArgs<ExtArgs>;
						result:
							| $Utils.Optional<ChatMessageCountAggregateOutputType>
							| number;
					};
				};
			};
		};
	} & {
		other: {
			payload: any;
			operations: {
				$executeRaw: {
					args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
					result: any;
				};
				$executeRawUnsafe: {
					args: [query: string, ...values: any[]];
					result: any;
				};
				$queryRaw: {
					args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
					result: any;
				};
				$queryRawUnsafe: {
					args: [query: string, ...values: any[]];
					result: any;
				};
			};
		};
	};
	export const defineExtension: $Extensions.ExtendsHook<
		"define",
		Prisma.TypeMapCb,
		$Extensions.DefaultArgs
	>;
	export type DefaultPrismaClient = PrismaClient;
	export type ErrorFormat = "pretty" | "colorless" | "minimal";
	export interface PrismaClientOptions {
		/**
		 * @default "colorless"
		 */
		errorFormat?: ErrorFormat;
		/**
		 * @example
		 * ```
		 * // Shorthand for `emit: 'stdout'`
		 * log: ['query', 'info', 'warn', 'error']
		 *
		 * // Emit as events only
		 * log: [
		 *   { emit: 'event', level: 'query' },
		 *   { emit: 'event', level: 'info' },
		 *   { emit: 'event', level: 'warn' }
		 *   { emit: 'event', level: 'error' }
		 * ]
		 *
		 * / Emit as events and log to stdout
		 * og: [
		 *  { emit: 'stdout', level: 'query' },
		 *  { emit: 'stdout', level: 'info' },
		 *  { emit: 'stdout', level: 'warn' }
		 *  { emit: 'stdout', level: 'error' }
		 *
		 * ```
		 * Read more in our [docs](https://pris.ly/d/logging).
		 */
		log?: (LogLevel | LogDefinition)[];
		/**
		 * The default values for transactionOptions
		 * maxWait ?= 2000
		 * timeout ?= 5000
		 */
		transactionOptions?: {
			maxWait?: number;
			timeout?: number;
			isolationLevel?: Prisma.TransactionIsolationLevel;
		};
		/**
		 * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
		 */
		adapter?: runtime.SqlDriverAdapterFactory;
		/**
		 * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
		 */
		accelerateUrl?: string;
		/**
		 * Global configuration for omitting model fields by default.
		 *
		 * @example
		 * ```
		 * const prisma = new PrismaClient({
		 *   omit: {
		 *     user: {
		 *       password: true
		 *     }
		 *   }
		 * })
		 * ```
		 */
		omit?: Prisma.GlobalOmitConfig;
		/**
		 * SQL commenter plugins that add metadata to SQL queries as comments.
		 * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
		 *
		 * @example
		 * ```
		 * const prisma = new PrismaClient({
		 *   adapter,
		 *   comments: [
		 *     traceContext(),
		 *     queryInsights(),
		 *   ],
		 * })
		 * ```
		 */
		comments?: runtime.SqlCommenterPlugin[];
	}
	export type GlobalOmitConfig = {
		user?: UserOmit;
		project?: ProjectOmit;
		projectVersion?: ProjectVersionOmit;
		projectFile?: ProjectFileOmit;
		chatMessage?: ChatMessageOmit;
	};

	/* Types for Logging */
	export type LogLevel = "info" | "query" | "warn" | "error";
	export type LogDefinition = {
		level: LogLevel;
		emit: "stdout" | "event";
	};

	export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

	export type GetLogType<T> = CheckIsLogLevel<
		T extends LogDefinition ? T["level"] : T
	>;

	export type GetEvents<T extends any[]> =
		T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;

	export type QueryEvent = {
		timestamp: Date;
		query: string;
		params: string;
		duration: number;
		target: string;
	};

	export type LogEvent = {
		timestamp: Date;
		message: string;
		target: string;
	};
	/* End Types for Logging */

	export type PrismaAction =
		| "findUnique"
		| "findUniqueOrThrow"
		| "findMany"
		| "findFirst"
		| "findFirstOrThrow"
		| "create"
		| "createMany"
		| "createManyAndReturn"
		| "update"
		| "updateMany"
		| "updateManyAndReturn"
		| "upsert"
		| "delete"
		| "deleteMany"
		| "executeRaw"
		| "queryRaw"
		| "aggregate"
		| "count"
		| "runCommandRaw"
		| "findRaw"
		| "groupBy";

	// tested in getLogLevel.test.ts
	export function getLogLevel(
		log: Array<LogLevel | LogDefinition>,
	): LogLevel | undefined;

	/**
	 * `PrismaClient` proxy available in interactive transactions.
	 */
	export type TransactionClient = Omit<
		Prisma.DefaultPrismaClient,
		runtime.ITXClientDenyList
	>;

	export type Datasource = {
		url?: string;
	};

	/**
	 * Count Types
	 */

	/**
	 * Count Type UserCountOutputType
	 */

	export type UserCountOutputType = {
		projects: number;
	};

	export type UserCountOutputTypeSelect<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		projects?: boolean | UserCountOutputTypeCountProjectsArgs;
	};

	// Custom InputTypes
	/**
	 * UserCountOutputType without action
	 */
	export type UserCountOutputTypeDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the UserCountOutputType
		 */
		select?: UserCountOutputTypeSelect<ExtArgs> | null;
	};

	/**
	 * UserCountOutputType without action
	 */
	export type UserCountOutputTypeCountProjectsArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: ProjectWhereInput;
	};

	/**
	 * Count Type ProjectCountOutputType
	 */

	export type ProjectCountOutputType = {
		versions: number;
		files: number;
		chatMessages: number;
	};

	export type ProjectCountOutputTypeSelect<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		versions?: boolean | ProjectCountOutputTypeCountVersionsArgs;
		files?: boolean | ProjectCountOutputTypeCountFilesArgs;
		chatMessages?: boolean | ProjectCountOutputTypeCountChatMessagesArgs;
	};

	// Custom InputTypes
	/**
	 * ProjectCountOutputType without action
	 */
	export type ProjectCountOutputTypeDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectCountOutputType
		 */
		select?: ProjectCountOutputTypeSelect<ExtArgs> | null;
	};

	/**
	 * ProjectCountOutputType without action
	 */
	export type ProjectCountOutputTypeCountVersionsArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: ProjectVersionWhereInput;
	};

	/**
	 * ProjectCountOutputType without action
	 */
	export type ProjectCountOutputTypeCountFilesArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: ProjectFileWhereInput;
	};

	/**
	 * ProjectCountOutputType without action
	 */
	export type ProjectCountOutputTypeCountChatMessagesArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: ChatMessageWhereInput;
	};

	/**
	 * Count Type ProjectVersionCountOutputType
	 */

	export type ProjectVersionCountOutputType = {
		files: number;
		chatMessages: number;
	};

	export type ProjectVersionCountOutputTypeSelect<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		files?: boolean | ProjectVersionCountOutputTypeCountFilesArgs;
		chatMessages?: boolean | ProjectVersionCountOutputTypeCountChatMessagesArgs;
	};

	// Custom InputTypes
	/**
	 * ProjectVersionCountOutputType without action
	 */
	export type ProjectVersionCountOutputTypeDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectVersionCountOutputType
		 */
		select?: ProjectVersionCountOutputTypeSelect<ExtArgs> | null;
	};

	/**
	 * ProjectVersionCountOutputType without action
	 */
	export type ProjectVersionCountOutputTypeCountFilesArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: ProjectFileWhereInput;
	};

	/**
	 * ProjectVersionCountOutputType without action
	 */
	export type ProjectVersionCountOutputTypeCountChatMessagesArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: ChatMessageWhereInput;
	};

	/**
	 * Models
	 */

	/**
	 * Model User
	 */

	export type AggregateUser = {
		_count: UserCountAggregateOutputType | null;
		_min: UserMinAggregateOutputType | null;
		_max: UserMaxAggregateOutputType | null;
	};

	export type UserMinAggregateOutputType = {
		id: string | null;
		email: string | null;
		name: string | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type UserMaxAggregateOutputType = {
		id: string | null;
		email: string | null;
		name: string | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type UserCountAggregateOutputType = {
		id: number;
		email: number;
		name: number;
		createdAt: number;
		updatedAt: number;
		_all: number;
	};

	export type UserMinAggregateInputType = {
		id?: true;
		email?: true;
		name?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type UserMaxAggregateInputType = {
		id?: true;
		email?: true;
		name?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type UserCountAggregateInputType = {
		id?: true;
		email?: true;
		name?: true;
		createdAt?: true;
		updatedAt?: true;
		_all?: true;
	};

	export type UserAggregateArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which User to aggregate.
		 */
		where?: UserWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Users to fetch.
		 */
		orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: UserWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Users from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Users.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned Users
		 **/
		_count?: true | UserCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: UserMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: UserMaxAggregateInputType;
	};

	export type GetUserAggregateType<T extends UserAggregateArgs> = {
		[P in keyof T & keyof AggregateUser]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregateUser[P]>
			: GetScalarType<T[P], AggregateUser[P]>;
	};

	export type UserGroupByArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: UserWhereInput;
		orderBy?:
			| UserOrderByWithAggregationInput
			| UserOrderByWithAggregationInput[];
		by: UserScalarFieldEnum[] | UserScalarFieldEnum;
		having?: UserScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: UserCountAggregateInputType | true;
		_min?: UserMinAggregateInputType;
		_max?: UserMaxAggregateInputType;
	};

	export type UserGroupByOutputType = {
		id: string;
		email: string;
		name: string | null;
		createdAt: Date;
		updatedAt: Date;
		_count: UserCountAggregateOutputType | null;
		_min: UserMinAggregateOutputType | null;
		_max: UserMaxAggregateOutputType | null;
	};

	type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
		Array<
			PickEnumerable<UserGroupByOutputType, T["by"]> & {
				[P in keyof T & keyof UserGroupByOutputType]: P extends "_count"
					? T[P] extends boolean
						? number
						: GetScalarType<T[P], UserGroupByOutputType[P]>
					: GetScalarType<T[P], UserGroupByOutputType[P]>;
			}
		>
	>;

	export type UserSelect<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			email?: boolean;
			name?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			projects?: boolean | User$projectsArgs<ExtArgs>;
			_count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["user"]
	>;

	export type UserSelectCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			email?: boolean;
			name?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
		},
		ExtArgs["result"]["user"]
	>;

	export type UserSelectUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			email?: boolean;
			name?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
		},
		ExtArgs["result"]["user"]
	>;

	export type UserSelectScalar = {
		id?: boolean;
		email?: boolean;
		name?: boolean;
		createdAt?: boolean;
		updatedAt?: boolean;
	};

	export type UserOmit<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetOmit<
		"id" | "email" | "name" | "createdAt" | "updatedAt",
		ExtArgs["result"]["user"]
	>;
	export type UserInclude<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		projects?: boolean | User$projectsArgs<ExtArgs>;
		_count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
	};
	export type UserIncludeCreateManyAndReturn<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {};
	export type UserIncludeUpdateManyAndReturn<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {};

	export type $UserPayload<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		name: "User";
		objects: {
			projects: Prisma.$ProjectPayload<ExtArgs>[];
		};
		scalars: $Extensions.GetPayloadResult<
			{
				id: string;
				email: string;
				name: string | null;
				createdAt: Date;
				updatedAt: Date;
			},
			ExtArgs["result"]["user"]
		>;
		composites: {};
	};

	type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> =
		$Result.GetResult<Prisma.$UserPayload, S>;

	type UserCountArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = Omit<UserFindManyArgs, "select" | "include" | "distinct" | "omit"> & {
		select?: UserCountAggregateInputType | true;
	};

	export interface UserDelegate<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> {
		[K: symbol]: {
			types: Prisma.TypeMap<ExtArgs>["model"]["User"];
			meta: { name: "User" };
		};
		/**
		 * Find zero or one User that matches the filter.
		 * @param {UserFindUniqueArgs} args - Arguments to find a User
		 * @example
		 * // Get one User
		 * const user = await prisma.user.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends UserFindUniqueArgs>(
			args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>,
		): Prisma__UserClient<
			$Result.GetResult<
				Prisma.$UserPayload<ExtArgs>,
				T,
				"findUnique",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one User that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
		 * @example
		 * // Get one User
		 * const user = await prisma.user.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
			args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>,
		): Prisma__UserClient<
			$Result.GetResult<
				Prisma.$UserPayload<ExtArgs>,
				T,
				"findUniqueOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first User that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {UserFindFirstArgs} args - Arguments to find a User
		 * @example
		 * // Get one User
		 * const user = await prisma.user.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends UserFindFirstArgs>(
			args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>,
		): Prisma__UserClient<
			$Result.GetResult<
				Prisma.$UserPayload<ExtArgs>,
				T,
				"findFirst",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first User that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
		 * @example
		 * // Get one User
		 * const user = await prisma.user.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
			args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>,
		): Prisma__UserClient<
			$Result.GetResult<
				Prisma.$UserPayload<ExtArgs>,
				T,
				"findFirstOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more Users that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all Users
		 * const users = await prisma.user.findMany()
		 *
		 * // Get first 10 Users
		 * const users = await prisma.user.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends UserFindManyArgs>(
			args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$UserPayload<ExtArgs>,
				T,
				"findMany",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create a User.
		 * @param {UserCreateArgs} args - Arguments to create a User.
		 * @example
		 * // Create one User
		 * const User = await prisma.user.create({
		 *   data: {
		 *     // ... data to create a User
		 *   }
		 * })
		 *
		 */
		create<T extends UserCreateArgs>(
			args: SelectSubset<T, UserCreateArgs<ExtArgs>>,
		): Prisma__UserClient<
			$Result.GetResult<
				Prisma.$UserPayload<ExtArgs>,
				T,
				"create",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Create many Users.
		 * @param {UserCreateManyArgs} args - Arguments to create many Users.
		 * @example
		 * // Create many Users
		 * const user = await prisma.user.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends UserCreateManyArgs>(
			args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many Users and returns the data saved in the database.
		 * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
		 * @example
		 * // Create many Users
		 * const user = await prisma.user.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many Users and only return the `id`
		 * const userWithIdOnly = await prisma.user.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends UserCreateManyAndReturnArgs>(
			args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$UserPayload<ExtArgs>,
				T,
				"createManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Delete a User.
		 * @param {UserDeleteArgs} args - Arguments to delete one User.
		 * @example
		 * // Delete one User
		 * const User = await prisma.user.delete({
		 *   where: {
		 *     // ... filter to delete one User
		 *   }
		 * })
		 *
		 */
		delete<T extends UserDeleteArgs>(
			args: SelectSubset<T, UserDeleteArgs<ExtArgs>>,
		): Prisma__UserClient<
			$Result.GetResult<
				Prisma.$UserPayload<ExtArgs>,
				T,
				"delete",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Update one User.
		 * @param {UserUpdateArgs} args - Arguments to update one User.
		 * @example
		 * // Update one User
		 * const user = await prisma.user.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends UserUpdateArgs>(
			args: SelectSubset<T, UserUpdateArgs<ExtArgs>>,
		): Prisma__UserClient<
			$Result.GetResult<
				Prisma.$UserPayload<ExtArgs>,
				T,
				"update",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Delete zero or more Users.
		 * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
		 * @example
		 * // Delete a few Users
		 * const { count } = await prisma.user.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends UserDeleteManyArgs>(
			args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Users.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many Users
		 * const user = await prisma.user.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends UserUpdateManyArgs>(
			args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Users and returns the data updated in the database.
		 * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
		 * @example
		 * // Update many Users
		 * const user = await prisma.user.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more Users and only return the `id`
		 * const userWithIdOnly = await prisma.user.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(
			args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$UserPayload<ExtArgs>,
				T,
				"updateManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create or update one User.
		 * @param {UserUpsertArgs} args - Arguments to update or create a User.
		 * @example
		 * // Update or create a User
		 * const user = await prisma.user.upsert({
		 *   create: {
		 *     // ... data to create a User
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the User we want to update
		 *   }
		 * })
		 */
		upsert<T extends UserUpsertArgs>(
			args: SelectSubset<T, UserUpsertArgs<ExtArgs>>,
		): Prisma__UserClient<
			$Result.GetResult<
				Prisma.$UserPayload<ExtArgs>,
				T,
				"upsert",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Count the number of Users.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {UserCountArgs} args - Arguments to filter Users to count.
		 * @example
		 * // Count the number of Users
		 * const count = await prisma.user.count({
		 *   where: {
		 *     // ... the filter for the Users we want to count
		 *   }
		 * })
		 **/
		count<T extends UserCountArgs>(
			args?: Subset<T, UserCountArgs>,
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any>
				? T["select"] extends true
					? number
					: GetScalarType<T["select"], UserCountAggregateOutputType>
				: number
		>;

		/**
		 * Allows you to perform aggregations operations on a User.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends UserAggregateArgs>(
			args: Subset<T, UserAggregateArgs>,
		): Prisma.PrismaPromise<GetUserAggregateType<T>>;

		/**
		 * Group by User.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {UserGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends UserGroupByArgs,
			HasSelectOrTake extends Or<
				Extends<"skip", Keys<T>>,
				Extends<"take", Keys<T>>
			>,
			OrderByArg extends True extends HasSelectOrTake
				? { orderBy: UserGroupByArgs["orderBy"] }
				: { orderBy?: UserGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<
				Keys<MaybeTupleToUnion<T["orderBy"]>>
			>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [
											Error,
											"Field ",
											P,
											` in "having" needs to be provided in "by"`,
										];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields
												? never
												: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors,
		): {} extends InputErrors
			? GetUserGroupByPayload<T>
			: Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the User model
		 */
		readonly fields: UserFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for User.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__UserClient<
		T,
		Null = never,
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		projects<T extends User$projectsArgs<ExtArgs> = {}>(
			args?: Subset<T, User$projectsArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			| $Result.GetResult<
					Prisma.$ProjectPayload<ExtArgs>,
					T,
					"findMany",
					GlobalOmitOptions
			  >
			| Null
		>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?:
				| ((value: T) => TResult1 | PromiseLike<TResult1>)
				| undefined
				| null,
			onrejected?:
				| ((reason: any) => TResult2 | PromiseLike<TResult2>)
				| undefined
				| null,
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(
			onrejected?:
				| ((reason: any) => TResult | PromiseLike<TResult>)
				| undefined
				| null,
		): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the User model
	 */
	interface UserFieldRefs {
		readonly id: FieldRef<"User", "String">;
		readonly email: FieldRef<"User", "String">;
		readonly name: FieldRef<"User", "String">;
		readonly createdAt: FieldRef<"User", "DateTime">;
		readonly updatedAt: FieldRef<"User", "DateTime">;
	}

	// Custom InputTypes
	/**
	 * User findUnique
	 */
	export type UserFindUniqueArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * Filter, which User to fetch.
		 */
		where: UserWhereUniqueInput;
	};

	/**
	 * User findUniqueOrThrow
	 */
	export type UserFindUniqueOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * Filter, which User to fetch.
		 */
		where: UserWhereUniqueInput;
	};

	/**
	 * User findFirst
	 */
	export type UserFindFirstArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * Filter, which User to fetch.
		 */
		where?: UserWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Users to fetch.
		 */
		orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Users.
		 */
		cursor?: UserWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Users from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Users.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Users.
		 */
		distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
	};

	/**
	 * User findFirstOrThrow
	 */
	export type UserFindFirstOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * Filter, which User to fetch.
		 */
		where?: UserWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Users to fetch.
		 */
		orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Users.
		 */
		cursor?: UserWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Users from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Users.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Users.
		 */
		distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
	};

	/**
	 * User findMany
	 */
	export type UserFindManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * Filter, which Users to fetch.
		 */
		where?: UserWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Users to fetch.
		 */
		orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing Users.
		 */
		cursor?: UserWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Users from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Users.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Users.
		 */
		distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
	};

	/**
	 * User create
	 */
	export type UserCreateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * The data needed to create a User.
		 */
		data: XOR<UserCreateInput, UserUncheckedCreateInput>;
	};

	/**
	 * User createMany
	 */
	export type UserCreateManyArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to create many Users.
		 */
		data: UserCreateManyInput | UserCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * User createManyAndReturn
	 */
	export type UserCreateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * The data used to create many Users.
		 */
		data: UserCreateManyInput | UserCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * User update
	 */
	export type UserUpdateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * The data needed to update a User.
		 */
		data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
		/**
		 * Choose, which User to update.
		 */
		where: UserWhereUniqueInput;
	};

	/**
	 * User updateMany
	 */
	export type UserUpdateManyArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to update Users.
		 */
		data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
		/**
		 * Filter which Users to update
		 */
		where?: UserWhereInput;
		/**
		 * Limit how many Users to update.
		 */
		limit?: number;
	};

	/**
	 * User updateManyAndReturn
	 */
	export type UserUpdateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * The data used to update Users.
		 */
		data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
		/**
		 * Filter which Users to update
		 */
		where?: UserWhereInput;
		/**
		 * Limit how many Users to update.
		 */
		limit?: number;
	};

	/**
	 * User upsert
	 */
	export type UserUpsertArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * The filter to search for the User to update in case it exists.
		 */
		where: UserWhereUniqueInput;
		/**
		 * In case the User found by the `where` argument doesn't exist, create a new User with this data.
		 */
		create: XOR<UserCreateInput, UserUncheckedCreateInput>;
		/**
		 * In case the User was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
	};

	/**
	 * User delete
	 */
	export type UserDeleteArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * Filter which User to delete.
		 */
		where: UserWhereUniqueInput;
	};

	/**
	 * User deleteMany
	 */
	export type UserDeleteManyArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which Users to delete
		 */
		where?: UserWhereInput;
		/**
		 * Limit how many Users to delete.
		 */
		limit?: number;
	};

	/**
	 * User.projects
	 */
	export type User$projectsArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Project
		 */
		select?: ProjectSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Project
		 */
		omit?: ProjectOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectInclude<ExtArgs> | null;
		where?: ProjectWhereInput;
		orderBy?:
			| ProjectOrderByWithRelationInput
			| ProjectOrderByWithRelationInput[];
		cursor?: ProjectWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[];
	};

	/**
	 * User without action
	 */
	export type UserDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
	};

	/**
	 * Model Project
	 */

	export type AggregateProject = {
		_count: ProjectCountAggregateOutputType | null;
		_min: ProjectMinAggregateOutputType | null;
		_max: ProjectMaxAggregateOutputType | null;
	};

	export type ProjectMinAggregateOutputType = {
		id: string | null;
		userId: string | null;
		name: string | null;
		description: string | null;
		status: $Enums.ProjectStatus | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type ProjectMaxAggregateOutputType = {
		id: string | null;
		userId: string | null;
		name: string | null;
		description: string | null;
		status: $Enums.ProjectStatus | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type ProjectCountAggregateOutputType = {
		id: number;
		userId: number;
		name: number;
		description: number;
		status: number;
		createdAt: number;
		updatedAt: number;
		_all: number;
	};

	export type ProjectMinAggregateInputType = {
		id?: true;
		userId?: true;
		name?: true;
		description?: true;
		status?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type ProjectMaxAggregateInputType = {
		id?: true;
		userId?: true;
		name?: true;
		description?: true;
		status?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type ProjectCountAggregateInputType = {
		id?: true;
		userId?: true;
		name?: true;
		description?: true;
		status?: true;
		createdAt?: true;
		updatedAt?: true;
		_all?: true;
	};

	export type ProjectAggregateArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which Project to aggregate.
		 */
		where?: ProjectWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Projects to fetch.
		 */
		orderBy?:
			| ProjectOrderByWithRelationInput
			| ProjectOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: ProjectWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Projects from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Projects.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned Projects
		 **/
		_count?: true | ProjectCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: ProjectMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: ProjectMaxAggregateInputType;
	};

	export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
		[P in keyof T & keyof AggregateProject]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregateProject[P]>
			: GetScalarType<T[P], AggregateProject[P]>;
	};

	export type ProjectGroupByArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: ProjectWhereInput;
		orderBy?:
			| ProjectOrderByWithAggregationInput
			| ProjectOrderByWithAggregationInput[];
		by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum;
		having?: ProjectScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: ProjectCountAggregateInputType | true;
		_min?: ProjectMinAggregateInputType;
		_max?: ProjectMaxAggregateInputType;
	};

	export type ProjectGroupByOutputType = {
		id: string;
		userId: string;
		name: string;
		description: string;
		status: $Enums.ProjectStatus;
		createdAt: Date;
		updatedAt: Date;
		_count: ProjectCountAggregateOutputType | null;
		_min: ProjectMinAggregateOutputType | null;
		_max: ProjectMaxAggregateOutputType | null;
	};

	type GetProjectGroupByPayload<T extends ProjectGroupByArgs> =
		Prisma.PrismaPromise<
			Array<
				PickEnumerable<ProjectGroupByOutputType, T["by"]> & {
					[P in keyof T & keyof ProjectGroupByOutputType]: P extends "_count"
						? T[P] extends boolean
							? number
							: GetScalarType<T[P], ProjectGroupByOutputType[P]>
						: GetScalarType<T[P], ProjectGroupByOutputType[P]>;
				}
			>
		>;

	export type ProjectSelect<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			userId?: boolean;
			name?: boolean;
			description?: boolean;
			status?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			user?: boolean | UserDefaultArgs<ExtArgs>;
			versions?: boolean | Project$versionsArgs<ExtArgs>;
			files?: boolean | Project$filesArgs<ExtArgs>;
			chatMessages?: boolean | Project$chatMessagesArgs<ExtArgs>;
			_count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["project"]
	>;

	export type ProjectSelectCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			userId?: boolean;
			name?: boolean;
			description?: boolean;
			status?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			user?: boolean | UserDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["project"]
	>;

	export type ProjectSelectUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			userId?: boolean;
			name?: boolean;
			description?: boolean;
			status?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			user?: boolean | UserDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["project"]
	>;

	export type ProjectSelectScalar = {
		id?: boolean;
		userId?: boolean;
		name?: boolean;
		description?: boolean;
		status?: boolean;
		createdAt?: boolean;
		updatedAt?: boolean;
	};

	export type ProjectOmit<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetOmit<
		| "id"
		| "userId"
		| "name"
		| "description"
		| "status"
		| "createdAt"
		| "updatedAt",
		ExtArgs["result"]["project"]
	>;
	export type ProjectInclude<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		user?: boolean | UserDefaultArgs<ExtArgs>;
		versions?: boolean | Project$versionsArgs<ExtArgs>;
		files?: boolean | Project$filesArgs<ExtArgs>;
		chatMessages?: boolean | Project$chatMessagesArgs<ExtArgs>;
		_count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>;
	};
	export type ProjectIncludeCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		user?: boolean | UserDefaultArgs<ExtArgs>;
	};
	export type ProjectIncludeUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		user?: boolean | UserDefaultArgs<ExtArgs>;
	};

	export type $ProjectPayload<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		name: "Project";
		objects: {
			user: Prisma.$UserPayload<ExtArgs>;
			versions: Prisma.$ProjectVersionPayload<ExtArgs>[];
			files: Prisma.$ProjectFilePayload<ExtArgs>[];
			chatMessages: Prisma.$ChatMessagePayload<ExtArgs>[];
		};
		scalars: $Extensions.GetPayloadResult<
			{
				id: string;
				userId: string;
				name: string;
				description: string;
				status: $Enums.ProjectStatus;
				createdAt: Date;
				updatedAt: Date;
			},
			ExtArgs["result"]["project"]
		>;
		composites: {};
	};

	type ProjectGetPayload<
		S extends boolean | null | undefined | ProjectDefaultArgs,
	> = $Result.GetResult<Prisma.$ProjectPayload, S>;

	type ProjectCountArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = Omit<ProjectFindManyArgs, "select" | "include" | "distinct" | "omit"> & {
		select?: ProjectCountAggregateInputType | true;
	};

	export interface ProjectDelegate<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> {
		[K: symbol]: {
			types: Prisma.TypeMap<ExtArgs>["model"]["Project"];
			meta: { name: "Project" };
		};
		/**
		 * Find zero or one Project that matches the filter.
		 * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
		 * @example
		 * // Get one Project
		 * const project = await prisma.project.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends ProjectFindUniqueArgs>(
			args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>,
		): Prisma__ProjectClient<
			$Result.GetResult<
				Prisma.$ProjectPayload<ExtArgs>,
				T,
				"findUnique",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one Project that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
		 * @example
		 * // Get one Project
		 * const project = await prisma.project.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(
			args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>,
		): Prisma__ProjectClient<
			$Result.GetResult<
				Prisma.$ProjectPayload<ExtArgs>,
				T,
				"findUniqueOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first Project that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectFindFirstArgs} args - Arguments to find a Project
		 * @example
		 * // Get one Project
		 * const project = await prisma.project.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends ProjectFindFirstArgs>(
			args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>,
		): Prisma__ProjectClient<
			$Result.GetResult<
				Prisma.$ProjectPayload<ExtArgs>,
				T,
				"findFirst",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first Project that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
		 * @example
		 * // Get one Project
		 * const project = await prisma.project.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(
			args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>,
		): Prisma__ProjectClient<
			$Result.GetResult<
				Prisma.$ProjectPayload<ExtArgs>,
				T,
				"findFirstOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more Projects that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all Projects
		 * const projects = await prisma.project.findMany()
		 *
		 * // Get first 10 Projects
		 * const projects = await prisma.project.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends ProjectFindManyArgs>(
			args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$ProjectPayload<ExtArgs>,
				T,
				"findMany",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create a Project.
		 * @param {ProjectCreateArgs} args - Arguments to create a Project.
		 * @example
		 * // Create one Project
		 * const Project = await prisma.project.create({
		 *   data: {
		 *     // ... data to create a Project
		 *   }
		 * })
		 *
		 */
		create<T extends ProjectCreateArgs>(
			args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>,
		): Prisma__ProjectClient<
			$Result.GetResult<
				Prisma.$ProjectPayload<ExtArgs>,
				T,
				"create",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Create many Projects.
		 * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
		 * @example
		 * // Create many Projects
		 * const project = await prisma.project.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends ProjectCreateManyArgs>(
			args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many Projects and returns the data saved in the database.
		 * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
		 * @example
		 * // Create many Projects
		 * const project = await prisma.project.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many Projects and only return the `id`
		 * const projectWithIdOnly = await prisma.project.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(
			args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$ProjectPayload<ExtArgs>,
				T,
				"createManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Delete a Project.
		 * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
		 * @example
		 * // Delete one Project
		 * const Project = await prisma.project.delete({
		 *   where: {
		 *     // ... filter to delete one Project
		 *   }
		 * })
		 *
		 */
		delete<T extends ProjectDeleteArgs>(
			args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>,
		): Prisma__ProjectClient<
			$Result.GetResult<
				Prisma.$ProjectPayload<ExtArgs>,
				T,
				"delete",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Update one Project.
		 * @param {ProjectUpdateArgs} args - Arguments to update one Project.
		 * @example
		 * // Update one Project
		 * const project = await prisma.project.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends ProjectUpdateArgs>(
			args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>,
		): Prisma__ProjectClient<
			$Result.GetResult<
				Prisma.$ProjectPayload<ExtArgs>,
				T,
				"update",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Delete zero or more Projects.
		 * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
		 * @example
		 * // Delete a few Projects
		 * const { count } = await prisma.project.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends ProjectDeleteManyArgs>(
			args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Projects.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many Projects
		 * const project = await prisma.project.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends ProjectUpdateManyArgs>(
			args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Projects and returns the data updated in the database.
		 * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
		 * @example
		 * // Update many Projects
		 * const project = await prisma.project.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more Projects and only return the `id`
		 * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(
			args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$ProjectPayload<ExtArgs>,
				T,
				"updateManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create or update one Project.
		 * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
		 * @example
		 * // Update or create a Project
		 * const project = await prisma.project.upsert({
		 *   create: {
		 *     // ... data to create a Project
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the Project we want to update
		 *   }
		 * })
		 */
		upsert<T extends ProjectUpsertArgs>(
			args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>,
		): Prisma__ProjectClient<
			$Result.GetResult<
				Prisma.$ProjectPayload<ExtArgs>,
				T,
				"upsert",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Count the number of Projects.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
		 * @example
		 * // Count the number of Projects
		 * const count = await prisma.project.count({
		 *   where: {
		 *     // ... the filter for the Projects we want to count
		 *   }
		 * })
		 **/
		count<T extends ProjectCountArgs>(
			args?: Subset<T, ProjectCountArgs>,
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any>
				? T["select"] extends true
					? number
					: GetScalarType<T["select"], ProjectCountAggregateOutputType>
				: number
		>;

		/**
		 * Allows you to perform aggregations operations on a Project.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends ProjectAggregateArgs>(
			args: Subset<T, ProjectAggregateArgs>,
		): Prisma.PrismaPromise<GetProjectAggregateType<T>>;

		/**
		 * Group by Project.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends ProjectGroupByArgs,
			HasSelectOrTake extends Or<
				Extends<"skip", Keys<T>>,
				Extends<"take", Keys<T>>
			>,
			OrderByArg extends True extends HasSelectOrTake
				? { orderBy: ProjectGroupByArgs["orderBy"] }
				: { orderBy?: ProjectGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<
				Keys<MaybeTupleToUnion<T["orderBy"]>>
			>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [
											Error,
											"Field ",
											P,
											` in "having" needs to be provided in "by"`,
										];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields
												? never
												: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors,
		): {} extends InputErrors
			? GetProjectGroupByPayload<T>
			: Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the Project model
		 */
		readonly fields: ProjectFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for Project.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__ProjectClient<
		T,
		Null = never,
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		user<T extends UserDefaultArgs<ExtArgs> = {}>(
			args?: Subset<T, UserDefaultArgs<ExtArgs>>,
		): Prisma__UserClient<
			| $Result.GetResult<
					Prisma.$UserPayload<ExtArgs>,
					T,
					"findUniqueOrThrow",
					GlobalOmitOptions
			  >
			| Null,
			Null,
			ExtArgs,
			GlobalOmitOptions
		>;
		versions<T extends Project$versionsArgs<ExtArgs> = {}>(
			args?: Subset<T, Project$versionsArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			| $Result.GetResult<
					Prisma.$ProjectVersionPayload<ExtArgs>,
					T,
					"findMany",
					GlobalOmitOptions
			  >
			| Null
		>;
		files<T extends Project$filesArgs<ExtArgs> = {}>(
			args?: Subset<T, Project$filesArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			| $Result.GetResult<
					Prisma.$ProjectFilePayload<ExtArgs>,
					T,
					"findMany",
					GlobalOmitOptions
			  >
			| Null
		>;
		chatMessages<T extends Project$chatMessagesArgs<ExtArgs> = {}>(
			args?: Subset<T, Project$chatMessagesArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			| $Result.GetResult<
					Prisma.$ChatMessagePayload<ExtArgs>,
					T,
					"findMany",
					GlobalOmitOptions
			  >
			| Null
		>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?:
				| ((value: T) => TResult1 | PromiseLike<TResult1>)
				| undefined
				| null,
			onrejected?:
				| ((reason: any) => TResult2 | PromiseLike<TResult2>)
				| undefined
				| null,
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(
			onrejected?:
				| ((reason: any) => TResult | PromiseLike<TResult>)
				| undefined
				| null,
		): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the Project model
	 */
	interface ProjectFieldRefs {
		readonly id: FieldRef<"Project", "String">;
		readonly userId: FieldRef<"Project", "String">;
		readonly name: FieldRef<"Project", "String">;
		readonly description: FieldRef<"Project", "String">;
		readonly status: FieldRef<"Project", "ProjectStatus">;
		readonly createdAt: FieldRef<"Project", "DateTime">;
		readonly updatedAt: FieldRef<"Project", "DateTime">;
	}

	// Custom InputTypes
	/**
	 * Project findUnique
	 */
	export type ProjectFindUniqueArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Project
		 */
		select?: ProjectSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Project
		 */
		omit?: ProjectOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectInclude<ExtArgs> | null;
		/**
		 * Filter, which Project to fetch.
		 */
		where: ProjectWhereUniqueInput;
	};

	/**
	 * Project findUniqueOrThrow
	 */
	export type ProjectFindUniqueOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Project
		 */
		select?: ProjectSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Project
		 */
		omit?: ProjectOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectInclude<ExtArgs> | null;
		/**
		 * Filter, which Project to fetch.
		 */
		where: ProjectWhereUniqueInput;
	};

	/**
	 * Project findFirst
	 */
	export type ProjectFindFirstArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Project
		 */
		select?: ProjectSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Project
		 */
		omit?: ProjectOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectInclude<ExtArgs> | null;
		/**
		 * Filter, which Project to fetch.
		 */
		where?: ProjectWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Projects to fetch.
		 */
		orderBy?:
			| ProjectOrderByWithRelationInput
			| ProjectOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Projects.
		 */
		cursor?: ProjectWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Projects from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Projects.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Projects.
		 */
		distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[];
	};

	/**
	 * Project findFirstOrThrow
	 */
	export type ProjectFindFirstOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Project
		 */
		select?: ProjectSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Project
		 */
		omit?: ProjectOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectInclude<ExtArgs> | null;
		/**
		 * Filter, which Project to fetch.
		 */
		where?: ProjectWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Projects to fetch.
		 */
		orderBy?:
			| ProjectOrderByWithRelationInput
			| ProjectOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Projects.
		 */
		cursor?: ProjectWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Projects from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Projects.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Projects.
		 */
		distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[];
	};

	/**
	 * Project findMany
	 */
	export type ProjectFindManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Project
		 */
		select?: ProjectSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Project
		 */
		omit?: ProjectOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectInclude<ExtArgs> | null;
		/**
		 * Filter, which Projects to fetch.
		 */
		where?: ProjectWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Projects to fetch.
		 */
		orderBy?:
			| ProjectOrderByWithRelationInput
			| ProjectOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing Projects.
		 */
		cursor?: ProjectWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Projects from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Projects.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Projects.
		 */
		distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[];
	};

	/**
	 * Project create
	 */
	export type ProjectCreateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Project
		 */
		select?: ProjectSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Project
		 */
		omit?: ProjectOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectInclude<ExtArgs> | null;
		/**
		 * The data needed to create a Project.
		 */
		data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>;
	};

	/**
	 * Project createMany
	 */
	export type ProjectCreateManyArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to create many Projects.
		 */
		data: ProjectCreateManyInput | ProjectCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * Project createManyAndReturn
	 */
	export type ProjectCreateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Project
		 */
		select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the Project
		 */
		omit?: ProjectOmit<ExtArgs> | null;
		/**
		 * The data used to create many Projects.
		 */
		data: ProjectCreateManyInput | ProjectCreateManyInput[];
		skipDuplicates?: boolean;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * Project update
	 */
	export type ProjectUpdateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Project
		 */
		select?: ProjectSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Project
		 */
		omit?: ProjectOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectInclude<ExtArgs> | null;
		/**
		 * The data needed to update a Project.
		 */
		data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>;
		/**
		 * Choose, which Project to update.
		 */
		where: ProjectWhereUniqueInput;
	};

	/**
	 * Project updateMany
	 */
	export type ProjectUpdateManyArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to update Projects.
		 */
		data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>;
		/**
		 * Filter which Projects to update
		 */
		where?: ProjectWhereInput;
		/**
		 * Limit how many Projects to update.
		 */
		limit?: number;
	};

	/**
	 * Project updateManyAndReturn
	 */
	export type ProjectUpdateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Project
		 */
		select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the Project
		 */
		omit?: ProjectOmit<ExtArgs> | null;
		/**
		 * The data used to update Projects.
		 */
		data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>;
		/**
		 * Filter which Projects to update
		 */
		where?: ProjectWhereInput;
		/**
		 * Limit how many Projects to update.
		 */
		limit?: number;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectIncludeUpdateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * Project upsert
	 */
	export type ProjectUpsertArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Project
		 */
		select?: ProjectSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Project
		 */
		omit?: ProjectOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectInclude<ExtArgs> | null;
		/**
		 * The filter to search for the Project to update in case it exists.
		 */
		where: ProjectWhereUniqueInput;
		/**
		 * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
		 */
		create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>;
		/**
		 * In case the Project was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>;
	};

	/**
	 * Project delete
	 */
	export type ProjectDeleteArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Project
		 */
		select?: ProjectSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Project
		 */
		omit?: ProjectOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectInclude<ExtArgs> | null;
		/**
		 * Filter which Project to delete.
		 */
		where: ProjectWhereUniqueInput;
	};

	/**
	 * Project deleteMany
	 */
	export type ProjectDeleteManyArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which Projects to delete
		 */
		where?: ProjectWhereInput;
		/**
		 * Limit how many Projects to delete.
		 */
		limit?: number;
	};

	/**
	 * Project.versions
	 */
	export type Project$versionsArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectVersion
		 */
		select?: ProjectVersionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectVersion
		 */
		omit?: ProjectVersionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectVersionInclude<ExtArgs> | null;
		where?: ProjectVersionWhereInput;
		orderBy?:
			| ProjectVersionOrderByWithRelationInput
			| ProjectVersionOrderByWithRelationInput[];
		cursor?: ProjectVersionWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: ProjectVersionScalarFieldEnum | ProjectVersionScalarFieldEnum[];
	};

	/**
	 * Project.files
	 */
	export type Project$filesArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectFile
		 */
		select?: ProjectFileSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectFile
		 */
		omit?: ProjectFileOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectFileInclude<ExtArgs> | null;
		where?: ProjectFileWhereInput;
		orderBy?:
			| ProjectFileOrderByWithRelationInput
			| ProjectFileOrderByWithRelationInput[];
		cursor?: ProjectFileWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[];
	};

	/**
	 * Project.chatMessages
	 */
	export type Project$chatMessagesArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ChatMessage
		 */
		select?: ChatMessageSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ChatMessage
		 */
		omit?: ChatMessageOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ChatMessageInclude<ExtArgs> | null;
		where?: ChatMessageWhereInput;
		orderBy?:
			| ChatMessageOrderByWithRelationInput
			| ChatMessageOrderByWithRelationInput[];
		cursor?: ChatMessageWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[];
	};

	/**
	 * Project without action
	 */
	export type ProjectDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Project
		 */
		select?: ProjectSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Project
		 */
		omit?: ProjectOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectInclude<ExtArgs> | null;
	};

	/**
	 * Model ProjectVersion
	 */

	export type AggregateProjectVersion = {
		_count: ProjectVersionCountAggregateOutputType | null;
		_avg: ProjectVersionAvgAggregateOutputType | null;
		_sum: ProjectVersionSumAggregateOutputType | null;
		_min: ProjectVersionMinAggregateOutputType | null;
		_max: ProjectVersionMaxAggregateOutputType | null;
	};

	export type ProjectVersionAvgAggregateOutputType = {
		versionNumber: number | null;
	};

	export type ProjectVersionSumAggregateOutputType = {
		versionNumber: number | null;
	};

	export type ProjectVersionMinAggregateOutputType = {
		id: string | null;
		projectId: string | null;
		versionNumber: number | null;
		label: string | null;
		createdAt: Date | null;
	};

	export type ProjectVersionMaxAggregateOutputType = {
		id: string | null;
		projectId: string | null;
		versionNumber: number | null;
		label: string | null;
		createdAt: Date | null;
	};

	export type ProjectVersionCountAggregateOutputType = {
		id: number;
		projectId: number;
		versionNumber: number;
		label: number;
		createdAt: number;
		_all: number;
	};

	export type ProjectVersionAvgAggregateInputType = {
		versionNumber?: true;
	};

	export type ProjectVersionSumAggregateInputType = {
		versionNumber?: true;
	};

	export type ProjectVersionMinAggregateInputType = {
		id?: true;
		projectId?: true;
		versionNumber?: true;
		label?: true;
		createdAt?: true;
	};

	export type ProjectVersionMaxAggregateInputType = {
		id?: true;
		projectId?: true;
		versionNumber?: true;
		label?: true;
		createdAt?: true;
	};

	export type ProjectVersionCountAggregateInputType = {
		id?: true;
		projectId?: true;
		versionNumber?: true;
		label?: true;
		createdAt?: true;
		_all?: true;
	};

	export type ProjectVersionAggregateArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which ProjectVersion to aggregate.
		 */
		where?: ProjectVersionWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of ProjectVersions to fetch.
		 */
		orderBy?:
			| ProjectVersionOrderByWithRelationInput
			| ProjectVersionOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: ProjectVersionWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` ProjectVersions from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` ProjectVersions.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned ProjectVersions
		 **/
		_count?: true | ProjectVersionCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to average
		 **/
		_avg?: ProjectVersionAvgAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to sum
		 **/
		_sum?: ProjectVersionSumAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: ProjectVersionMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: ProjectVersionMaxAggregateInputType;
	};

	export type GetProjectVersionAggregateType<
		T extends ProjectVersionAggregateArgs,
	> = {
		[P in keyof T & keyof AggregateProjectVersion]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregateProjectVersion[P]>
			: GetScalarType<T[P], AggregateProjectVersion[P]>;
	};

	export type ProjectVersionGroupByArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: ProjectVersionWhereInput;
		orderBy?:
			| ProjectVersionOrderByWithAggregationInput
			| ProjectVersionOrderByWithAggregationInput[];
		by: ProjectVersionScalarFieldEnum[] | ProjectVersionScalarFieldEnum;
		having?: ProjectVersionScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: ProjectVersionCountAggregateInputType | true;
		_avg?: ProjectVersionAvgAggregateInputType;
		_sum?: ProjectVersionSumAggregateInputType;
		_min?: ProjectVersionMinAggregateInputType;
		_max?: ProjectVersionMaxAggregateInputType;
	};

	export type ProjectVersionGroupByOutputType = {
		id: string;
		projectId: string;
		versionNumber: number;
		label: string | null;
		createdAt: Date;
		_count: ProjectVersionCountAggregateOutputType | null;
		_avg: ProjectVersionAvgAggregateOutputType | null;
		_sum: ProjectVersionSumAggregateOutputType | null;
		_min: ProjectVersionMinAggregateOutputType | null;
		_max: ProjectVersionMaxAggregateOutputType | null;
	};

	type GetProjectVersionGroupByPayload<T extends ProjectVersionGroupByArgs> =
		Prisma.PrismaPromise<
			Array<
				PickEnumerable<ProjectVersionGroupByOutputType, T["by"]> & {
					[P in keyof T &
						keyof ProjectVersionGroupByOutputType]: P extends "_count"
						? T[P] extends boolean
							? number
							: GetScalarType<T[P], ProjectVersionGroupByOutputType[P]>
						: GetScalarType<T[P], ProjectVersionGroupByOutputType[P]>;
				}
			>
		>;

	export type ProjectVersionSelect<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			projectId?: boolean;
			versionNumber?: boolean;
			label?: boolean;
			createdAt?: boolean;
			project?: boolean | ProjectDefaultArgs<ExtArgs>;
			files?: boolean | ProjectVersion$filesArgs<ExtArgs>;
			chatMessages?: boolean | ProjectVersion$chatMessagesArgs<ExtArgs>;
			_count?: boolean | ProjectVersionCountOutputTypeDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["projectVersion"]
	>;

	export type ProjectVersionSelectCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			projectId?: boolean;
			versionNumber?: boolean;
			label?: boolean;
			createdAt?: boolean;
			project?: boolean | ProjectDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["projectVersion"]
	>;

	export type ProjectVersionSelectUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			projectId?: boolean;
			versionNumber?: boolean;
			label?: boolean;
			createdAt?: boolean;
			project?: boolean | ProjectDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["projectVersion"]
	>;

	export type ProjectVersionSelectScalar = {
		id?: boolean;
		projectId?: boolean;
		versionNumber?: boolean;
		label?: boolean;
		createdAt?: boolean;
	};

	export type ProjectVersionOmit<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetOmit<
		"id" | "projectId" | "versionNumber" | "label" | "createdAt",
		ExtArgs["result"]["projectVersion"]
	>;
	export type ProjectVersionInclude<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		project?: boolean | ProjectDefaultArgs<ExtArgs>;
		files?: boolean | ProjectVersion$filesArgs<ExtArgs>;
		chatMessages?: boolean | ProjectVersion$chatMessagesArgs<ExtArgs>;
		_count?: boolean | ProjectVersionCountOutputTypeDefaultArgs<ExtArgs>;
	};
	export type ProjectVersionIncludeCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		project?: boolean | ProjectDefaultArgs<ExtArgs>;
	};
	export type ProjectVersionIncludeUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		project?: boolean | ProjectDefaultArgs<ExtArgs>;
	};

	export type $ProjectVersionPayload<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		name: "ProjectVersion";
		objects: {
			project: Prisma.$ProjectPayload<ExtArgs>;
			files: Prisma.$ProjectFilePayload<ExtArgs>[];
			chatMessages: Prisma.$ChatMessagePayload<ExtArgs>[];
		};
		scalars: $Extensions.GetPayloadResult<
			{
				id: string;
				projectId: string;
				versionNumber: number;
				label: string | null;
				createdAt: Date;
			},
			ExtArgs["result"]["projectVersion"]
		>;
		composites: {};
	};

	type ProjectVersionGetPayload<
		S extends boolean | null | undefined | ProjectVersionDefaultArgs,
	> = $Result.GetResult<Prisma.$ProjectVersionPayload, S>;

	type ProjectVersionCountArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = Omit<
		ProjectVersionFindManyArgs,
		"select" | "include" | "distinct" | "omit"
	> & {
		select?: ProjectVersionCountAggregateInputType | true;
	};

	export interface ProjectVersionDelegate<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> {
		[K: symbol]: {
			types: Prisma.TypeMap<ExtArgs>["model"]["ProjectVersion"];
			meta: { name: "ProjectVersion" };
		};
		/**
		 * Find zero or one ProjectVersion that matches the filter.
		 * @param {ProjectVersionFindUniqueArgs} args - Arguments to find a ProjectVersion
		 * @example
		 * // Get one ProjectVersion
		 * const projectVersion = await prisma.projectVersion.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends ProjectVersionFindUniqueArgs>(
			args: SelectSubset<T, ProjectVersionFindUniqueArgs<ExtArgs>>,
		): Prisma__ProjectVersionClient<
			$Result.GetResult<
				Prisma.$ProjectVersionPayload<ExtArgs>,
				T,
				"findUnique",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one ProjectVersion that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {ProjectVersionFindUniqueOrThrowArgs} args - Arguments to find a ProjectVersion
		 * @example
		 * // Get one ProjectVersion
		 * const projectVersion = await prisma.projectVersion.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends ProjectVersionFindUniqueOrThrowArgs>(
			args: SelectSubset<T, ProjectVersionFindUniqueOrThrowArgs<ExtArgs>>,
		): Prisma__ProjectVersionClient<
			$Result.GetResult<
				Prisma.$ProjectVersionPayload<ExtArgs>,
				T,
				"findUniqueOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first ProjectVersion that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectVersionFindFirstArgs} args - Arguments to find a ProjectVersion
		 * @example
		 * // Get one ProjectVersion
		 * const projectVersion = await prisma.projectVersion.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends ProjectVersionFindFirstArgs>(
			args?: SelectSubset<T, ProjectVersionFindFirstArgs<ExtArgs>>,
		): Prisma__ProjectVersionClient<
			$Result.GetResult<
				Prisma.$ProjectVersionPayload<ExtArgs>,
				T,
				"findFirst",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first ProjectVersion that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectVersionFindFirstOrThrowArgs} args - Arguments to find a ProjectVersion
		 * @example
		 * // Get one ProjectVersion
		 * const projectVersion = await prisma.projectVersion.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends ProjectVersionFindFirstOrThrowArgs>(
			args?: SelectSubset<T, ProjectVersionFindFirstOrThrowArgs<ExtArgs>>,
		): Prisma__ProjectVersionClient<
			$Result.GetResult<
				Prisma.$ProjectVersionPayload<ExtArgs>,
				T,
				"findFirstOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more ProjectVersions that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectVersionFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all ProjectVersions
		 * const projectVersions = await prisma.projectVersion.findMany()
		 *
		 * // Get first 10 ProjectVersions
		 * const projectVersions = await prisma.projectVersion.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const projectVersionWithIdOnly = await prisma.projectVersion.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends ProjectVersionFindManyArgs>(
			args?: SelectSubset<T, ProjectVersionFindManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$ProjectVersionPayload<ExtArgs>,
				T,
				"findMany",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create a ProjectVersion.
		 * @param {ProjectVersionCreateArgs} args - Arguments to create a ProjectVersion.
		 * @example
		 * // Create one ProjectVersion
		 * const ProjectVersion = await prisma.projectVersion.create({
		 *   data: {
		 *     // ... data to create a ProjectVersion
		 *   }
		 * })
		 *
		 */
		create<T extends ProjectVersionCreateArgs>(
			args: SelectSubset<T, ProjectVersionCreateArgs<ExtArgs>>,
		): Prisma__ProjectVersionClient<
			$Result.GetResult<
				Prisma.$ProjectVersionPayload<ExtArgs>,
				T,
				"create",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Create many ProjectVersions.
		 * @param {ProjectVersionCreateManyArgs} args - Arguments to create many ProjectVersions.
		 * @example
		 * // Create many ProjectVersions
		 * const projectVersion = await prisma.projectVersion.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends ProjectVersionCreateManyArgs>(
			args?: SelectSubset<T, ProjectVersionCreateManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many ProjectVersions and returns the data saved in the database.
		 * @param {ProjectVersionCreateManyAndReturnArgs} args - Arguments to create many ProjectVersions.
		 * @example
		 * // Create many ProjectVersions
		 * const projectVersion = await prisma.projectVersion.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many ProjectVersions and only return the `id`
		 * const projectVersionWithIdOnly = await prisma.projectVersion.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends ProjectVersionCreateManyAndReturnArgs>(
			args?: SelectSubset<T, ProjectVersionCreateManyAndReturnArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$ProjectVersionPayload<ExtArgs>,
				T,
				"createManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Delete a ProjectVersion.
		 * @param {ProjectVersionDeleteArgs} args - Arguments to delete one ProjectVersion.
		 * @example
		 * // Delete one ProjectVersion
		 * const ProjectVersion = await prisma.projectVersion.delete({
		 *   where: {
		 *     // ... filter to delete one ProjectVersion
		 *   }
		 * })
		 *
		 */
		delete<T extends ProjectVersionDeleteArgs>(
			args: SelectSubset<T, ProjectVersionDeleteArgs<ExtArgs>>,
		): Prisma__ProjectVersionClient<
			$Result.GetResult<
				Prisma.$ProjectVersionPayload<ExtArgs>,
				T,
				"delete",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Update one ProjectVersion.
		 * @param {ProjectVersionUpdateArgs} args - Arguments to update one ProjectVersion.
		 * @example
		 * // Update one ProjectVersion
		 * const projectVersion = await prisma.projectVersion.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends ProjectVersionUpdateArgs>(
			args: SelectSubset<T, ProjectVersionUpdateArgs<ExtArgs>>,
		): Prisma__ProjectVersionClient<
			$Result.GetResult<
				Prisma.$ProjectVersionPayload<ExtArgs>,
				T,
				"update",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Delete zero or more ProjectVersions.
		 * @param {ProjectVersionDeleteManyArgs} args - Arguments to filter ProjectVersions to delete.
		 * @example
		 * // Delete a few ProjectVersions
		 * const { count } = await prisma.projectVersion.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends ProjectVersionDeleteManyArgs>(
			args?: SelectSubset<T, ProjectVersionDeleteManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more ProjectVersions.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectVersionUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many ProjectVersions
		 * const projectVersion = await prisma.projectVersion.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends ProjectVersionUpdateManyArgs>(
			args: SelectSubset<T, ProjectVersionUpdateManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more ProjectVersions and returns the data updated in the database.
		 * @param {ProjectVersionUpdateManyAndReturnArgs} args - Arguments to update many ProjectVersions.
		 * @example
		 * // Update many ProjectVersions
		 * const projectVersion = await prisma.projectVersion.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more ProjectVersions and only return the `id`
		 * const projectVersionWithIdOnly = await prisma.projectVersion.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends ProjectVersionUpdateManyAndReturnArgs>(
			args: SelectSubset<T, ProjectVersionUpdateManyAndReturnArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$ProjectVersionPayload<ExtArgs>,
				T,
				"updateManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create or update one ProjectVersion.
		 * @param {ProjectVersionUpsertArgs} args - Arguments to update or create a ProjectVersion.
		 * @example
		 * // Update or create a ProjectVersion
		 * const projectVersion = await prisma.projectVersion.upsert({
		 *   create: {
		 *     // ... data to create a ProjectVersion
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the ProjectVersion we want to update
		 *   }
		 * })
		 */
		upsert<T extends ProjectVersionUpsertArgs>(
			args: SelectSubset<T, ProjectVersionUpsertArgs<ExtArgs>>,
		): Prisma__ProjectVersionClient<
			$Result.GetResult<
				Prisma.$ProjectVersionPayload<ExtArgs>,
				T,
				"upsert",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Count the number of ProjectVersions.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectVersionCountArgs} args - Arguments to filter ProjectVersions to count.
		 * @example
		 * // Count the number of ProjectVersions
		 * const count = await prisma.projectVersion.count({
		 *   where: {
		 *     // ... the filter for the ProjectVersions we want to count
		 *   }
		 * })
		 **/
		count<T extends ProjectVersionCountArgs>(
			args?: Subset<T, ProjectVersionCountArgs>,
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any>
				? T["select"] extends true
					? number
					: GetScalarType<T["select"], ProjectVersionCountAggregateOutputType>
				: number
		>;

		/**
		 * Allows you to perform aggregations operations on a ProjectVersion.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends ProjectVersionAggregateArgs>(
			args: Subset<T, ProjectVersionAggregateArgs>,
		): Prisma.PrismaPromise<GetProjectVersionAggregateType<T>>;

		/**
		 * Group by ProjectVersion.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectVersionGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends ProjectVersionGroupByArgs,
			HasSelectOrTake extends Or<
				Extends<"skip", Keys<T>>,
				Extends<"take", Keys<T>>
			>,
			OrderByArg extends True extends HasSelectOrTake
				? { orderBy: ProjectVersionGroupByArgs["orderBy"] }
				: { orderBy?: ProjectVersionGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<
				Keys<MaybeTupleToUnion<T["orderBy"]>>
			>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [
											Error,
											"Field ",
											P,
											` in "having" needs to be provided in "by"`,
										];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields
												? never
												: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, ProjectVersionGroupByArgs, OrderByArg> &
				InputErrors,
		): {} extends InputErrors
			? GetProjectVersionGroupByPayload<T>
			: Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the ProjectVersion model
		 */
		readonly fields: ProjectVersionFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for ProjectVersion.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__ProjectVersionClient<
		T,
		Null = never,
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		project<T extends ProjectDefaultArgs<ExtArgs> = {}>(
			args?: Subset<T, ProjectDefaultArgs<ExtArgs>>,
		): Prisma__ProjectClient<
			| $Result.GetResult<
					Prisma.$ProjectPayload<ExtArgs>,
					T,
					"findUniqueOrThrow",
					GlobalOmitOptions
			  >
			| Null,
			Null,
			ExtArgs,
			GlobalOmitOptions
		>;
		files<T extends ProjectVersion$filesArgs<ExtArgs> = {}>(
			args?: Subset<T, ProjectVersion$filesArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			| $Result.GetResult<
					Prisma.$ProjectFilePayload<ExtArgs>,
					T,
					"findMany",
					GlobalOmitOptions
			  >
			| Null
		>;
		chatMessages<T extends ProjectVersion$chatMessagesArgs<ExtArgs> = {}>(
			args?: Subset<T, ProjectVersion$chatMessagesArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			| $Result.GetResult<
					Prisma.$ChatMessagePayload<ExtArgs>,
					T,
					"findMany",
					GlobalOmitOptions
			  >
			| Null
		>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?:
				| ((value: T) => TResult1 | PromiseLike<TResult1>)
				| undefined
				| null,
			onrejected?:
				| ((reason: any) => TResult2 | PromiseLike<TResult2>)
				| undefined
				| null,
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(
			onrejected?:
				| ((reason: any) => TResult | PromiseLike<TResult>)
				| undefined
				| null,
		): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the ProjectVersion model
	 */
	interface ProjectVersionFieldRefs {
		readonly id: FieldRef<"ProjectVersion", "String">;
		readonly projectId: FieldRef<"ProjectVersion", "String">;
		readonly versionNumber: FieldRef<"ProjectVersion", "Int">;
		readonly label: FieldRef<"ProjectVersion", "String">;
		readonly createdAt: FieldRef<"ProjectVersion", "DateTime">;
	}

	// Custom InputTypes
	/**
	 * ProjectVersion findUnique
	 */
	export type ProjectVersionFindUniqueArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectVersion
		 */
		select?: ProjectVersionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectVersion
		 */
		omit?: ProjectVersionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectVersionInclude<ExtArgs> | null;
		/**
		 * Filter, which ProjectVersion to fetch.
		 */
		where: ProjectVersionWhereUniqueInput;
	};

	/**
	 * ProjectVersion findUniqueOrThrow
	 */
	export type ProjectVersionFindUniqueOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectVersion
		 */
		select?: ProjectVersionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectVersion
		 */
		omit?: ProjectVersionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectVersionInclude<ExtArgs> | null;
		/**
		 * Filter, which ProjectVersion to fetch.
		 */
		where: ProjectVersionWhereUniqueInput;
	};

	/**
	 * ProjectVersion findFirst
	 */
	export type ProjectVersionFindFirstArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectVersion
		 */
		select?: ProjectVersionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectVersion
		 */
		omit?: ProjectVersionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectVersionInclude<ExtArgs> | null;
		/**
		 * Filter, which ProjectVersion to fetch.
		 */
		where?: ProjectVersionWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of ProjectVersions to fetch.
		 */
		orderBy?:
			| ProjectVersionOrderByWithRelationInput
			| ProjectVersionOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for ProjectVersions.
		 */
		cursor?: ProjectVersionWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` ProjectVersions from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` ProjectVersions.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of ProjectVersions.
		 */
		distinct?: ProjectVersionScalarFieldEnum | ProjectVersionScalarFieldEnum[];
	};

	/**
	 * ProjectVersion findFirstOrThrow
	 */
	export type ProjectVersionFindFirstOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectVersion
		 */
		select?: ProjectVersionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectVersion
		 */
		omit?: ProjectVersionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectVersionInclude<ExtArgs> | null;
		/**
		 * Filter, which ProjectVersion to fetch.
		 */
		where?: ProjectVersionWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of ProjectVersions to fetch.
		 */
		orderBy?:
			| ProjectVersionOrderByWithRelationInput
			| ProjectVersionOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for ProjectVersions.
		 */
		cursor?: ProjectVersionWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` ProjectVersions from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` ProjectVersions.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of ProjectVersions.
		 */
		distinct?: ProjectVersionScalarFieldEnum | ProjectVersionScalarFieldEnum[];
	};

	/**
	 * ProjectVersion findMany
	 */
	export type ProjectVersionFindManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectVersion
		 */
		select?: ProjectVersionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectVersion
		 */
		omit?: ProjectVersionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectVersionInclude<ExtArgs> | null;
		/**
		 * Filter, which ProjectVersions to fetch.
		 */
		where?: ProjectVersionWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of ProjectVersions to fetch.
		 */
		orderBy?:
			| ProjectVersionOrderByWithRelationInput
			| ProjectVersionOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing ProjectVersions.
		 */
		cursor?: ProjectVersionWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` ProjectVersions from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` ProjectVersions.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of ProjectVersions.
		 */
		distinct?: ProjectVersionScalarFieldEnum | ProjectVersionScalarFieldEnum[];
	};

	/**
	 * ProjectVersion create
	 */
	export type ProjectVersionCreateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectVersion
		 */
		select?: ProjectVersionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectVersion
		 */
		omit?: ProjectVersionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectVersionInclude<ExtArgs> | null;
		/**
		 * The data needed to create a ProjectVersion.
		 */
		data: XOR<ProjectVersionCreateInput, ProjectVersionUncheckedCreateInput>;
	};

	/**
	 * ProjectVersion createMany
	 */
	export type ProjectVersionCreateManyArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to create many ProjectVersions.
		 */
		data: ProjectVersionCreateManyInput | ProjectVersionCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * ProjectVersion createManyAndReturn
	 */
	export type ProjectVersionCreateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectVersion
		 */
		select?: ProjectVersionSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectVersion
		 */
		omit?: ProjectVersionOmit<ExtArgs> | null;
		/**
		 * The data used to create many ProjectVersions.
		 */
		data: ProjectVersionCreateManyInput | ProjectVersionCreateManyInput[];
		skipDuplicates?: boolean;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectVersionIncludeCreateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * ProjectVersion update
	 */
	export type ProjectVersionUpdateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectVersion
		 */
		select?: ProjectVersionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectVersion
		 */
		omit?: ProjectVersionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectVersionInclude<ExtArgs> | null;
		/**
		 * The data needed to update a ProjectVersion.
		 */
		data: XOR<ProjectVersionUpdateInput, ProjectVersionUncheckedUpdateInput>;
		/**
		 * Choose, which ProjectVersion to update.
		 */
		where: ProjectVersionWhereUniqueInput;
	};

	/**
	 * ProjectVersion updateMany
	 */
	export type ProjectVersionUpdateManyArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to update ProjectVersions.
		 */
		data: XOR<
			ProjectVersionUpdateManyMutationInput,
			ProjectVersionUncheckedUpdateManyInput
		>;
		/**
		 * Filter which ProjectVersions to update
		 */
		where?: ProjectVersionWhereInput;
		/**
		 * Limit how many ProjectVersions to update.
		 */
		limit?: number;
	};

	/**
	 * ProjectVersion updateManyAndReturn
	 */
	export type ProjectVersionUpdateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectVersion
		 */
		select?: ProjectVersionSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectVersion
		 */
		omit?: ProjectVersionOmit<ExtArgs> | null;
		/**
		 * The data used to update ProjectVersions.
		 */
		data: XOR<
			ProjectVersionUpdateManyMutationInput,
			ProjectVersionUncheckedUpdateManyInput
		>;
		/**
		 * Filter which ProjectVersions to update
		 */
		where?: ProjectVersionWhereInput;
		/**
		 * Limit how many ProjectVersions to update.
		 */
		limit?: number;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectVersionIncludeUpdateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * ProjectVersion upsert
	 */
	export type ProjectVersionUpsertArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectVersion
		 */
		select?: ProjectVersionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectVersion
		 */
		omit?: ProjectVersionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectVersionInclude<ExtArgs> | null;
		/**
		 * The filter to search for the ProjectVersion to update in case it exists.
		 */
		where: ProjectVersionWhereUniqueInput;
		/**
		 * In case the ProjectVersion found by the `where` argument doesn't exist, create a new ProjectVersion with this data.
		 */
		create: XOR<ProjectVersionCreateInput, ProjectVersionUncheckedCreateInput>;
		/**
		 * In case the ProjectVersion was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<ProjectVersionUpdateInput, ProjectVersionUncheckedUpdateInput>;
	};

	/**
	 * ProjectVersion delete
	 */
	export type ProjectVersionDeleteArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectVersion
		 */
		select?: ProjectVersionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectVersion
		 */
		omit?: ProjectVersionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectVersionInclude<ExtArgs> | null;
		/**
		 * Filter which ProjectVersion to delete.
		 */
		where: ProjectVersionWhereUniqueInput;
	};

	/**
	 * ProjectVersion deleteMany
	 */
	export type ProjectVersionDeleteManyArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which ProjectVersions to delete
		 */
		where?: ProjectVersionWhereInput;
		/**
		 * Limit how many ProjectVersions to delete.
		 */
		limit?: number;
	};

	/**
	 * ProjectVersion.files
	 */
	export type ProjectVersion$filesArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectFile
		 */
		select?: ProjectFileSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectFile
		 */
		omit?: ProjectFileOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectFileInclude<ExtArgs> | null;
		where?: ProjectFileWhereInput;
		orderBy?:
			| ProjectFileOrderByWithRelationInput
			| ProjectFileOrderByWithRelationInput[];
		cursor?: ProjectFileWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[];
	};

	/**
	 * ProjectVersion.chatMessages
	 */
	export type ProjectVersion$chatMessagesArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ChatMessage
		 */
		select?: ChatMessageSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ChatMessage
		 */
		omit?: ChatMessageOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ChatMessageInclude<ExtArgs> | null;
		where?: ChatMessageWhereInput;
		orderBy?:
			| ChatMessageOrderByWithRelationInput
			| ChatMessageOrderByWithRelationInput[];
		cursor?: ChatMessageWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[];
	};

	/**
	 * ProjectVersion without action
	 */
	export type ProjectVersionDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectVersion
		 */
		select?: ProjectVersionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectVersion
		 */
		omit?: ProjectVersionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectVersionInclude<ExtArgs> | null;
	};

	/**
	 * Model ProjectFile
	 */

	export type AggregateProjectFile = {
		_count: ProjectFileCountAggregateOutputType | null;
		_min: ProjectFileMinAggregateOutputType | null;
		_max: ProjectFileMaxAggregateOutputType | null;
	};

	export type ProjectFileMinAggregateOutputType = {
		id: string | null;
		projectId: string | null;
		versionId: string | null;
		path: string | null;
		content: string | null;
		fileSource: $Enums.FileSource | null;
		updatedAt: Date | null;
	};

	export type ProjectFileMaxAggregateOutputType = {
		id: string | null;
		projectId: string | null;
		versionId: string | null;
		path: string | null;
		content: string | null;
		fileSource: $Enums.FileSource | null;
		updatedAt: Date | null;
	};

	export type ProjectFileCountAggregateOutputType = {
		id: number;
		projectId: number;
		versionId: number;
		path: number;
		content: number;
		fileSource: number;
		updatedAt: number;
		_all: number;
	};

	export type ProjectFileMinAggregateInputType = {
		id?: true;
		projectId?: true;
		versionId?: true;
		path?: true;
		content?: true;
		fileSource?: true;
		updatedAt?: true;
	};

	export type ProjectFileMaxAggregateInputType = {
		id?: true;
		projectId?: true;
		versionId?: true;
		path?: true;
		content?: true;
		fileSource?: true;
		updatedAt?: true;
	};

	export type ProjectFileCountAggregateInputType = {
		id?: true;
		projectId?: true;
		versionId?: true;
		path?: true;
		content?: true;
		fileSource?: true;
		updatedAt?: true;
		_all?: true;
	};

	export type ProjectFileAggregateArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which ProjectFile to aggregate.
		 */
		where?: ProjectFileWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of ProjectFiles to fetch.
		 */
		orderBy?:
			| ProjectFileOrderByWithRelationInput
			| ProjectFileOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: ProjectFileWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` ProjectFiles from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` ProjectFiles.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned ProjectFiles
		 **/
		_count?: true | ProjectFileCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: ProjectFileMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: ProjectFileMaxAggregateInputType;
	};

	export type GetProjectFileAggregateType<T extends ProjectFileAggregateArgs> =
		{
			[P in keyof T & keyof AggregateProjectFile]: P extends "_count" | "count"
				? T[P] extends true
					? number
					: GetScalarType<T[P], AggregateProjectFile[P]>
				: GetScalarType<T[P], AggregateProjectFile[P]>;
		};

	export type ProjectFileGroupByArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: ProjectFileWhereInput;
		orderBy?:
			| ProjectFileOrderByWithAggregationInput
			| ProjectFileOrderByWithAggregationInput[];
		by: ProjectFileScalarFieldEnum[] | ProjectFileScalarFieldEnum;
		having?: ProjectFileScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: ProjectFileCountAggregateInputType | true;
		_min?: ProjectFileMinAggregateInputType;
		_max?: ProjectFileMaxAggregateInputType;
	};

	export type ProjectFileGroupByOutputType = {
		id: string;
		projectId: string;
		versionId: string;
		path: string;
		content: string;
		fileSource: $Enums.FileSource;
		updatedAt: Date;
		_count: ProjectFileCountAggregateOutputType | null;
		_min: ProjectFileMinAggregateOutputType | null;
		_max: ProjectFileMaxAggregateOutputType | null;
	};

	type GetProjectFileGroupByPayload<T extends ProjectFileGroupByArgs> =
		Prisma.PrismaPromise<
			Array<
				PickEnumerable<ProjectFileGroupByOutputType, T["by"]> & {
					[P in keyof T &
						keyof ProjectFileGroupByOutputType]: P extends "_count"
						? T[P] extends boolean
							? number
							: GetScalarType<T[P], ProjectFileGroupByOutputType[P]>
						: GetScalarType<T[P], ProjectFileGroupByOutputType[P]>;
				}
			>
		>;

	export type ProjectFileSelect<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			projectId?: boolean;
			versionId?: boolean;
			path?: boolean;
			content?: boolean;
			fileSource?: boolean;
			updatedAt?: boolean;
			project?: boolean | ProjectDefaultArgs<ExtArgs>;
			version?: boolean | ProjectVersionDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["projectFile"]
	>;

	export type ProjectFileSelectCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			projectId?: boolean;
			versionId?: boolean;
			path?: boolean;
			content?: boolean;
			fileSource?: boolean;
			updatedAt?: boolean;
			project?: boolean | ProjectDefaultArgs<ExtArgs>;
			version?: boolean | ProjectVersionDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["projectFile"]
	>;

	export type ProjectFileSelectUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			projectId?: boolean;
			versionId?: boolean;
			path?: boolean;
			content?: boolean;
			fileSource?: boolean;
			updatedAt?: boolean;
			project?: boolean | ProjectDefaultArgs<ExtArgs>;
			version?: boolean | ProjectVersionDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["projectFile"]
	>;

	export type ProjectFileSelectScalar = {
		id?: boolean;
		projectId?: boolean;
		versionId?: boolean;
		path?: boolean;
		content?: boolean;
		fileSource?: boolean;
		updatedAt?: boolean;
	};

	export type ProjectFileOmit<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetOmit<
		| "id"
		| "projectId"
		| "versionId"
		| "path"
		| "content"
		| "fileSource"
		| "updatedAt",
		ExtArgs["result"]["projectFile"]
	>;
	export type ProjectFileInclude<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		project?: boolean | ProjectDefaultArgs<ExtArgs>;
		version?: boolean | ProjectVersionDefaultArgs<ExtArgs>;
	};
	export type ProjectFileIncludeCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		project?: boolean | ProjectDefaultArgs<ExtArgs>;
		version?: boolean | ProjectVersionDefaultArgs<ExtArgs>;
	};
	export type ProjectFileIncludeUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		project?: boolean | ProjectDefaultArgs<ExtArgs>;
		version?: boolean | ProjectVersionDefaultArgs<ExtArgs>;
	};

	export type $ProjectFilePayload<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		name: "ProjectFile";
		objects: {
			project: Prisma.$ProjectPayload<ExtArgs>;
			version: Prisma.$ProjectVersionPayload<ExtArgs>;
		};
		scalars: $Extensions.GetPayloadResult<
			{
				id: string;
				projectId: string;
				versionId: string;
				path: string;
				content: string;
				fileSource: $Enums.FileSource;
				updatedAt: Date;
			},
			ExtArgs["result"]["projectFile"]
		>;
		composites: {};
	};

	type ProjectFileGetPayload<
		S extends boolean | null | undefined | ProjectFileDefaultArgs,
	> = $Result.GetResult<Prisma.$ProjectFilePayload, S>;

	type ProjectFileCountArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = Omit<
		ProjectFileFindManyArgs,
		"select" | "include" | "distinct" | "omit"
	> & {
		select?: ProjectFileCountAggregateInputType | true;
	};

	export interface ProjectFileDelegate<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> {
		[K: symbol]: {
			types: Prisma.TypeMap<ExtArgs>["model"]["ProjectFile"];
			meta: { name: "ProjectFile" };
		};
		/**
		 * Find zero or one ProjectFile that matches the filter.
		 * @param {ProjectFileFindUniqueArgs} args - Arguments to find a ProjectFile
		 * @example
		 * // Get one ProjectFile
		 * const projectFile = await prisma.projectFile.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends ProjectFileFindUniqueArgs>(
			args: SelectSubset<T, ProjectFileFindUniqueArgs<ExtArgs>>,
		): Prisma__ProjectFileClient<
			$Result.GetResult<
				Prisma.$ProjectFilePayload<ExtArgs>,
				T,
				"findUnique",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one ProjectFile that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {ProjectFileFindUniqueOrThrowArgs} args - Arguments to find a ProjectFile
		 * @example
		 * // Get one ProjectFile
		 * const projectFile = await prisma.projectFile.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends ProjectFileFindUniqueOrThrowArgs>(
			args: SelectSubset<T, ProjectFileFindUniqueOrThrowArgs<ExtArgs>>,
		): Prisma__ProjectFileClient<
			$Result.GetResult<
				Prisma.$ProjectFilePayload<ExtArgs>,
				T,
				"findUniqueOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first ProjectFile that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectFileFindFirstArgs} args - Arguments to find a ProjectFile
		 * @example
		 * // Get one ProjectFile
		 * const projectFile = await prisma.projectFile.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends ProjectFileFindFirstArgs>(
			args?: SelectSubset<T, ProjectFileFindFirstArgs<ExtArgs>>,
		): Prisma__ProjectFileClient<
			$Result.GetResult<
				Prisma.$ProjectFilePayload<ExtArgs>,
				T,
				"findFirst",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first ProjectFile that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectFileFindFirstOrThrowArgs} args - Arguments to find a ProjectFile
		 * @example
		 * // Get one ProjectFile
		 * const projectFile = await prisma.projectFile.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends ProjectFileFindFirstOrThrowArgs>(
			args?: SelectSubset<T, ProjectFileFindFirstOrThrowArgs<ExtArgs>>,
		): Prisma__ProjectFileClient<
			$Result.GetResult<
				Prisma.$ProjectFilePayload<ExtArgs>,
				T,
				"findFirstOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more ProjectFiles that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectFileFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all ProjectFiles
		 * const projectFiles = await prisma.projectFile.findMany()
		 *
		 * // Get first 10 ProjectFiles
		 * const projectFiles = await prisma.projectFile.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const projectFileWithIdOnly = await prisma.projectFile.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends ProjectFileFindManyArgs>(
			args?: SelectSubset<T, ProjectFileFindManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$ProjectFilePayload<ExtArgs>,
				T,
				"findMany",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create a ProjectFile.
		 * @param {ProjectFileCreateArgs} args - Arguments to create a ProjectFile.
		 * @example
		 * // Create one ProjectFile
		 * const ProjectFile = await prisma.projectFile.create({
		 *   data: {
		 *     // ... data to create a ProjectFile
		 *   }
		 * })
		 *
		 */
		create<T extends ProjectFileCreateArgs>(
			args: SelectSubset<T, ProjectFileCreateArgs<ExtArgs>>,
		): Prisma__ProjectFileClient<
			$Result.GetResult<
				Prisma.$ProjectFilePayload<ExtArgs>,
				T,
				"create",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Create many ProjectFiles.
		 * @param {ProjectFileCreateManyArgs} args - Arguments to create many ProjectFiles.
		 * @example
		 * // Create many ProjectFiles
		 * const projectFile = await prisma.projectFile.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends ProjectFileCreateManyArgs>(
			args?: SelectSubset<T, ProjectFileCreateManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many ProjectFiles and returns the data saved in the database.
		 * @param {ProjectFileCreateManyAndReturnArgs} args - Arguments to create many ProjectFiles.
		 * @example
		 * // Create many ProjectFiles
		 * const projectFile = await prisma.projectFile.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many ProjectFiles and only return the `id`
		 * const projectFileWithIdOnly = await prisma.projectFile.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends ProjectFileCreateManyAndReturnArgs>(
			args?: SelectSubset<T, ProjectFileCreateManyAndReturnArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$ProjectFilePayload<ExtArgs>,
				T,
				"createManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Delete a ProjectFile.
		 * @param {ProjectFileDeleteArgs} args - Arguments to delete one ProjectFile.
		 * @example
		 * // Delete one ProjectFile
		 * const ProjectFile = await prisma.projectFile.delete({
		 *   where: {
		 *     // ... filter to delete one ProjectFile
		 *   }
		 * })
		 *
		 */
		delete<T extends ProjectFileDeleteArgs>(
			args: SelectSubset<T, ProjectFileDeleteArgs<ExtArgs>>,
		): Prisma__ProjectFileClient<
			$Result.GetResult<
				Prisma.$ProjectFilePayload<ExtArgs>,
				T,
				"delete",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Update one ProjectFile.
		 * @param {ProjectFileUpdateArgs} args - Arguments to update one ProjectFile.
		 * @example
		 * // Update one ProjectFile
		 * const projectFile = await prisma.projectFile.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends ProjectFileUpdateArgs>(
			args: SelectSubset<T, ProjectFileUpdateArgs<ExtArgs>>,
		): Prisma__ProjectFileClient<
			$Result.GetResult<
				Prisma.$ProjectFilePayload<ExtArgs>,
				T,
				"update",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Delete zero or more ProjectFiles.
		 * @param {ProjectFileDeleteManyArgs} args - Arguments to filter ProjectFiles to delete.
		 * @example
		 * // Delete a few ProjectFiles
		 * const { count } = await prisma.projectFile.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends ProjectFileDeleteManyArgs>(
			args?: SelectSubset<T, ProjectFileDeleteManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more ProjectFiles.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectFileUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many ProjectFiles
		 * const projectFile = await prisma.projectFile.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends ProjectFileUpdateManyArgs>(
			args: SelectSubset<T, ProjectFileUpdateManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more ProjectFiles and returns the data updated in the database.
		 * @param {ProjectFileUpdateManyAndReturnArgs} args - Arguments to update many ProjectFiles.
		 * @example
		 * // Update many ProjectFiles
		 * const projectFile = await prisma.projectFile.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more ProjectFiles and only return the `id`
		 * const projectFileWithIdOnly = await prisma.projectFile.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends ProjectFileUpdateManyAndReturnArgs>(
			args: SelectSubset<T, ProjectFileUpdateManyAndReturnArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$ProjectFilePayload<ExtArgs>,
				T,
				"updateManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create or update one ProjectFile.
		 * @param {ProjectFileUpsertArgs} args - Arguments to update or create a ProjectFile.
		 * @example
		 * // Update or create a ProjectFile
		 * const projectFile = await prisma.projectFile.upsert({
		 *   create: {
		 *     // ... data to create a ProjectFile
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the ProjectFile we want to update
		 *   }
		 * })
		 */
		upsert<T extends ProjectFileUpsertArgs>(
			args: SelectSubset<T, ProjectFileUpsertArgs<ExtArgs>>,
		): Prisma__ProjectFileClient<
			$Result.GetResult<
				Prisma.$ProjectFilePayload<ExtArgs>,
				T,
				"upsert",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Count the number of ProjectFiles.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectFileCountArgs} args - Arguments to filter ProjectFiles to count.
		 * @example
		 * // Count the number of ProjectFiles
		 * const count = await prisma.projectFile.count({
		 *   where: {
		 *     // ... the filter for the ProjectFiles we want to count
		 *   }
		 * })
		 **/
		count<T extends ProjectFileCountArgs>(
			args?: Subset<T, ProjectFileCountArgs>,
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any>
				? T["select"] extends true
					? number
					: GetScalarType<T["select"], ProjectFileCountAggregateOutputType>
				: number
		>;

		/**
		 * Allows you to perform aggregations operations on a ProjectFile.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectFileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends ProjectFileAggregateArgs>(
			args: Subset<T, ProjectFileAggregateArgs>,
		): Prisma.PrismaPromise<GetProjectFileAggregateType<T>>;

		/**
		 * Group by ProjectFile.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ProjectFileGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends ProjectFileGroupByArgs,
			HasSelectOrTake extends Or<
				Extends<"skip", Keys<T>>,
				Extends<"take", Keys<T>>
			>,
			OrderByArg extends True extends HasSelectOrTake
				? { orderBy: ProjectFileGroupByArgs["orderBy"] }
				: { orderBy?: ProjectFileGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<
				Keys<MaybeTupleToUnion<T["orderBy"]>>
			>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [
											Error,
											"Field ",
											P,
											` in "having" needs to be provided in "by"`,
										];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields
												? never
												: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, ProjectFileGroupByArgs, OrderByArg> &
				InputErrors,
		): {} extends InputErrors
			? GetProjectFileGroupByPayload<T>
			: Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the ProjectFile model
		 */
		readonly fields: ProjectFileFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for ProjectFile.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__ProjectFileClient<
		T,
		Null = never,
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		project<T extends ProjectDefaultArgs<ExtArgs> = {}>(
			args?: Subset<T, ProjectDefaultArgs<ExtArgs>>,
		): Prisma__ProjectClient<
			| $Result.GetResult<
					Prisma.$ProjectPayload<ExtArgs>,
					T,
					"findUniqueOrThrow",
					GlobalOmitOptions
			  >
			| Null,
			Null,
			ExtArgs,
			GlobalOmitOptions
		>;
		version<T extends ProjectVersionDefaultArgs<ExtArgs> = {}>(
			args?: Subset<T, ProjectVersionDefaultArgs<ExtArgs>>,
		): Prisma__ProjectVersionClient<
			| $Result.GetResult<
					Prisma.$ProjectVersionPayload<ExtArgs>,
					T,
					"findUniqueOrThrow",
					GlobalOmitOptions
			  >
			| Null,
			Null,
			ExtArgs,
			GlobalOmitOptions
		>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?:
				| ((value: T) => TResult1 | PromiseLike<TResult1>)
				| undefined
				| null,
			onrejected?:
				| ((reason: any) => TResult2 | PromiseLike<TResult2>)
				| undefined
				| null,
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(
			onrejected?:
				| ((reason: any) => TResult | PromiseLike<TResult>)
				| undefined
				| null,
		): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the ProjectFile model
	 */
	interface ProjectFileFieldRefs {
		readonly id: FieldRef<"ProjectFile", "String">;
		readonly projectId: FieldRef<"ProjectFile", "String">;
		readonly versionId: FieldRef<"ProjectFile", "String">;
		readonly path: FieldRef<"ProjectFile", "String">;
		readonly content: FieldRef<"ProjectFile", "String">;
		readonly fileSource: FieldRef<"ProjectFile", "FileSource">;
		readonly updatedAt: FieldRef<"ProjectFile", "DateTime">;
	}

	// Custom InputTypes
	/**
	 * ProjectFile findUnique
	 */
	export type ProjectFileFindUniqueArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectFile
		 */
		select?: ProjectFileSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectFile
		 */
		omit?: ProjectFileOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectFileInclude<ExtArgs> | null;
		/**
		 * Filter, which ProjectFile to fetch.
		 */
		where: ProjectFileWhereUniqueInput;
	};

	/**
	 * ProjectFile findUniqueOrThrow
	 */
	export type ProjectFileFindUniqueOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectFile
		 */
		select?: ProjectFileSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectFile
		 */
		omit?: ProjectFileOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectFileInclude<ExtArgs> | null;
		/**
		 * Filter, which ProjectFile to fetch.
		 */
		where: ProjectFileWhereUniqueInput;
	};

	/**
	 * ProjectFile findFirst
	 */
	export type ProjectFileFindFirstArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectFile
		 */
		select?: ProjectFileSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectFile
		 */
		omit?: ProjectFileOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectFileInclude<ExtArgs> | null;
		/**
		 * Filter, which ProjectFile to fetch.
		 */
		where?: ProjectFileWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of ProjectFiles to fetch.
		 */
		orderBy?:
			| ProjectFileOrderByWithRelationInput
			| ProjectFileOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for ProjectFiles.
		 */
		cursor?: ProjectFileWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` ProjectFiles from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` ProjectFiles.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of ProjectFiles.
		 */
		distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[];
	};

	/**
	 * ProjectFile findFirstOrThrow
	 */
	export type ProjectFileFindFirstOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectFile
		 */
		select?: ProjectFileSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectFile
		 */
		omit?: ProjectFileOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectFileInclude<ExtArgs> | null;
		/**
		 * Filter, which ProjectFile to fetch.
		 */
		where?: ProjectFileWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of ProjectFiles to fetch.
		 */
		orderBy?:
			| ProjectFileOrderByWithRelationInput
			| ProjectFileOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for ProjectFiles.
		 */
		cursor?: ProjectFileWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` ProjectFiles from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` ProjectFiles.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of ProjectFiles.
		 */
		distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[];
	};

	/**
	 * ProjectFile findMany
	 */
	export type ProjectFileFindManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectFile
		 */
		select?: ProjectFileSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectFile
		 */
		omit?: ProjectFileOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectFileInclude<ExtArgs> | null;
		/**
		 * Filter, which ProjectFiles to fetch.
		 */
		where?: ProjectFileWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of ProjectFiles to fetch.
		 */
		orderBy?:
			| ProjectFileOrderByWithRelationInput
			| ProjectFileOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing ProjectFiles.
		 */
		cursor?: ProjectFileWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` ProjectFiles from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` ProjectFiles.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of ProjectFiles.
		 */
		distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[];
	};

	/**
	 * ProjectFile create
	 */
	export type ProjectFileCreateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectFile
		 */
		select?: ProjectFileSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectFile
		 */
		omit?: ProjectFileOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectFileInclude<ExtArgs> | null;
		/**
		 * The data needed to create a ProjectFile.
		 */
		data: XOR<ProjectFileCreateInput, ProjectFileUncheckedCreateInput>;
	};

	/**
	 * ProjectFile createMany
	 */
	export type ProjectFileCreateManyArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to create many ProjectFiles.
		 */
		data: ProjectFileCreateManyInput | ProjectFileCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * ProjectFile createManyAndReturn
	 */
	export type ProjectFileCreateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectFile
		 */
		select?: ProjectFileSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectFile
		 */
		omit?: ProjectFileOmit<ExtArgs> | null;
		/**
		 * The data used to create many ProjectFiles.
		 */
		data: ProjectFileCreateManyInput | ProjectFileCreateManyInput[];
		skipDuplicates?: boolean;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectFileIncludeCreateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * ProjectFile update
	 */
	export type ProjectFileUpdateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectFile
		 */
		select?: ProjectFileSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectFile
		 */
		omit?: ProjectFileOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectFileInclude<ExtArgs> | null;
		/**
		 * The data needed to update a ProjectFile.
		 */
		data: XOR<ProjectFileUpdateInput, ProjectFileUncheckedUpdateInput>;
		/**
		 * Choose, which ProjectFile to update.
		 */
		where: ProjectFileWhereUniqueInput;
	};

	/**
	 * ProjectFile updateMany
	 */
	export type ProjectFileUpdateManyArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to update ProjectFiles.
		 */
		data: XOR<
			ProjectFileUpdateManyMutationInput,
			ProjectFileUncheckedUpdateManyInput
		>;
		/**
		 * Filter which ProjectFiles to update
		 */
		where?: ProjectFileWhereInput;
		/**
		 * Limit how many ProjectFiles to update.
		 */
		limit?: number;
	};

	/**
	 * ProjectFile updateManyAndReturn
	 */
	export type ProjectFileUpdateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectFile
		 */
		select?: ProjectFileSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectFile
		 */
		omit?: ProjectFileOmit<ExtArgs> | null;
		/**
		 * The data used to update ProjectFiles.
		 */
		data: XOR<
			ProjectFileUpdateManyMutationInput,
			ProjectFileUncheckedUpdateManyInput
		>;
		/**
		 * Filter which ProjectFiles to update
		 */
		where?: ProjectFileWhereInput;
		/**
		 * Limit how many ProjectFiles to update.
		 */
		limit?: number;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectFileIncludeUpdateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * ProjectFile upsert
	 */
	export type ProjectFileUpsertArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectFile
		 */
		select?: ProjectFileSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectFile
		 */
		omit?: ProjectFileOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectFileInclude<ExtArgs> | null;
		/**
		 * The filter to search for the ProjectFile to update in case it exists.
		 */
		where: ProjectFileWhereUniqueInput;
		/**
		 * In case the ProjectFile found by the `where` argument doesn't exist, create a new ProjectFile with this data.
		 */
		create: XOR<ProjectFileCreateInput, ProjectFileUncheckedCreateInput>;
		/**
		 * In case the ProjectFile was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<ProjectFileUpdateInput, ProjectFileUncheckedUpdateInput>;
	};

	/**
	 * ProjectFile delete
	 */
	export type ProjectFileDeleteArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectFile
		 */
		select?: ProjectFileSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectFile
		 */
		omit?: ProjectFileOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectFileInclude<ExtArgs> | null;
		/**
		 * Filter which ProjectFile to delete.
		 */
		where: ProjectFileWhereUniqueInput;
	};

	/**
	 * ProjectFile deleteMany
	 */
	export type ProjectFileDeleteManyArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which ProjectFiles to delete
		 */
		where?: ProjectFileWhereInput;
		/**
		 * Limit how many ProjectFiles to delete.
		 */
		limit?: number;
	};

	/**
	 * ProjectFile without action
	 */
	export type ProjectFileDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ProjectFile
		 */
		select?: ProjectFileSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ProjectFile
		 */
		omit?: ProjectFileOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ProjectFileInclude<ExtArgs> | null;
	};

	/**
	 * Model ChatMessage
	 */

	export type AggregateChatMessage = {
		_count: ChatMessageCountAggregateOutputType | null;
		_min: ChatMessageMinAggregateOutputType | null;
		_max: ChatMessageMaxAggregateOutputType | null;
	};

	export type ChatMessageMinAggregateOutputType = {
		id: string | null;
		projectId: string | null;
		versionId: string | null;
		role: $Enums.MessageRole | null;
		content: string | null;
		createdAt: Date | null;
	};

	export type ChatMessageMaxAggregateOutputType = {
		id: string | null;
		projectId: string | null;
		versionId: string | null;
		role: $Enums.MessageRole | null;
		content: string | null;
		createdAt: Date | null;
	};

	export type ChatMessageCountAggregateOutputType = {
		id: number;
		projectId: number;
		versionId: number;
		role: number;
		content: number;
		fileChanges: number;
		createdAt: number;
		_all: number;
	};

	export type ChatMessageMinAggregateInputType = {
		id?: true;
		projectId?: true;
		versionId?: true;
		role?: true;
		content?: true;
		createdAt?: true;
	};

	export type ChatMessageMaxAggregateInputType = {
		id?: true;
		projectId?: true;
		versionId?: true;
		role?: true;
		content?: true;
		createdAt?: true;
	};

	export type ChatMessageCountAggregateInputType = {
		id?: true;
		projectId?: true;
		versionId?: true;
		role?: true;
		content?: true;
		fileChanges?: true;
		createdAt?: true;
		_all?: true;
	};

	export type ChatMessageAggregateArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which ChatMessage to aggregate.
		 */
		where?: ChatMessageWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of ChatMessages to fetch.
		 */
		orderBy?:
			| ChatMessageOrderByWithRelationInput
			| ChatMessageOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: ChatMessageWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` ChatMessages from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` ChatMessages.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned ChatMessages
		 **/
		_count?: true | ChatMessageCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: ChatMessageMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: ChatMessageMaxAggregateInputType;
	};

	export type GetChatMessageAggregateType<T extends ChatMessageAggregateArgs> =
		{
			[P in keyof T & keyof AggregateChatMessage]: P extends "_count" | "count"
				? T[P] extends true
					? number
					: GetScalarType<T[P], AggregateChatMessage[P]>
				: GetScalarType<T[P], AggregateChatMessage[P]>;
		};

	export type ChatMessageGroupByArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: ChatMessageWhereInput;
		orderBy?:
			| ChatMessageOrderByWithAggregationInput
			| ChatMessageOrderByWithAggregationInput[];
		by: ChatMessageScalarFieldEnum[] | ChatMessageScalarFieldEnum;
		having?: ChatMessageScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: ChatMessageCountAggregateInputType | true;
		_min?: ChatMessageMinAggregateInputType;
		_max?: ChatMessageMaxAggregateInputType;
	};

	export type ChatMessageGroupByOutputType = {
		id: string;
		projectId: string;
		versionId: string;
		role: $Enums.MessageRole;
		content: string;
		fileChanges: JsonValue | null;
		createdAt: Date;
		_count: ChatMessageCountAggregateOutputType | null;
		_min: ChatMessageMinAggregateOutputType | null;
		_max: ChatMessageMaxAggregateOutputType | null;
	};

	type GetChatMessageGroupByPayload<T extends ChatMessageGroupByArgs> =
		Prisma.PrismaPromise<
			Array<
				PickEnumerable<ChatMessageGroupByOutputType, T["by"]> & {
					[P in keyof T &
						keyof ChatMessageGroupByOutputType]: P extends "_count"
						? T[P] extends boolean
							? number
							: GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
						: GetScalarType<T[P], ChatMessageGroupByOutputType[P]>;
				}
			>
		>;

	export type ChatMessageSelect<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			projectId?: boolean;
			versionId?: boolean;
			role?: boolean;
			content?: boolean;
			fileChanges?: boolean;
			createdAt?: boolean;
			project?: boolean | ProjectDefaultArgs<ExtArgs>;
			version?: boolean | ProjectVersionDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["chatMessage"]
	>;

	export type ChatMessageSelectCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			projectId?: boolean;
			versionId?: boolean;
			role?: boolean;
			content?: boolean;
			fileChanges?: boolean;
			createdAt?: boolean;
			project?: boolean | ProjectDefaultArgs<ExtArgs>;
			version?: boolean | ProjectVersionDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["chatMessage"]
	>;

	export type ChatMessageSelectUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			projectId?: boolean;
			versionId?: boolean;
			role?: boolean;
			content?: boolean;
			fileChanges?: boolean;
			createdAt?: boolean;
			project?: boolean | ProjectDefaultArgs<ExtArgs>;
			version?: boolean | ProjectVersionDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["chatMessage"]
	>;

	export type ChatMessageSelectScalar = {
		id?: boolean;
		projectId?: boolean;
		versionId?: boolean;
		role?: boolean;
		content?: boolean;
		fileChanges?: boolean;
		createdAt?: boolean;
	};

	export type ChatMessageOmit<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetOmit<
		| "id"
		| "projectId"
		| "versionId"
		| "role"
		| "content"
		| "fileChanges"
		| "createdAt",
		ExtArgs["result"]["chatMessage"]
	>;
	export type ChatMessageInclude<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		project?: boolean | ProjectDefaultArgs<ExtArgs>;
		version?: boolean | ProjectVersionDefaultArgs<ExtArgs>;
	};
	export type ChatMessageIncludeCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		project?: boolean | ProjectDefaultArgs<ExtArgs>;
		version?: boolean | ProjectVersionDefaultArgs<ExtArgs>;
	};
	export type ChatMessageIncludeUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		project?: boolean | ProjectDefaultArgs<ExtArgs>;
		version?: boolean | ProjectVersionDefaultArgs<ExtArgs>;
	};

	export type $ChatMessagePayload<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		name: "ChatMessage";
		objects: {
			project: Prisma.$ProjectPayload<ExtArgs>;
			version: Prisma.$ProjectVersionPayload<ExtArgs>;
		};
		scalars: $Extensions.GetPayloadResult<
			{
				id: string;
				projectId: string;
				versionId: string;
				role: $Enums.MessageRole;
				content: string;
				fileChanges: Prisma.JsonValue | null;
				createdAt: Date;
			},
			ExtArgs["result"]["chatMessage"]
		>;
		composites: {};
	};

	type ChatMessageGetPayload<
		S extends boolean | null | undefined | ChatMessageDefaultArgs,
	> = $Result.GetResult<Prisma.$ChatMessagePayload, S>;

	type ChatMessageCountArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = Omit<
		ChatMessageFindManyArgs,
		"select" | "include" | "distinct" | "omit"
	> & {
		select?: ChatMessageCountAggregateInputType | true;
	};

	export interface ChatMessageDelegate<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> {
		[K: symbol]: {
			types: Prisma.TypeMap<ExtArgs>["model"]["ChatMessage"];
			meta: { name: "ChatMessage" };
		};
		/**
		 * Find zero or one ChatMessage that matches the filter.
		 * @param {ChatMessageFindUniqueArgs} args - Arguments to find a ChatMessage
		 * @example
		 * // Get one ChatMessage
		 * const chatMessage = await prisma.chatMessage.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends ChatMessageFindUniqueArgs>(
			args: SelectSubset<T, ChatMessageFindUniqueArgs<ExtArgs>>,
		): Prisma__ChatMessageClient<
			$Result.GetResult<
				Prisma.$ChatMessagePayload<ExtArgs>,
				T,
				"findUnique",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one ChatMessage that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {ChatMessageFindUniqueOrThrowArgs} args - Arguments to find a ChatMessage
		 * @example
		 * // Get one ChatMessage
		 * const chatMessage = await prisma.chatMessage.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends ChatMessageFindUniqueOrThrowArgs>(
			args: SelectSubset<T, ChatMessageFindUniqueOrThrowArgs<ExtArgs>>,
		): Prisma__ChatMessageClient<
			$Result.GetResult<
				Prisma.$ChatMessagePayload<ExtArgs>,
				T,
				"findUniqueOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first ChatMessage that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ChatMessageFindFirstArgs} args - Arguments to find a ChatMessage
		 * @example
		 * // Get one ChatMessage
		 * const chatMessage = await prisma.chatMessage.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends ChatMessageFindFirstArgs>(
			args?: SelectSubset<T, ChatMessageFindFirstArgs<ExtArgs>>,
		): Prisma__ChatMessageClient<
			$Result.GetResult<
				Prisma.$ChatMessagePayload<ExtArgs>,
				T,
				"findFirst",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first ChatMessage that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ChatMessageFindFirstOrThrowArgs} args - Arguments to find a ChatMessage
		 * @example
		 * // Get one ChatMessage
		 * const chatMessage = await prisma.chatMessage.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends ChatMessageFindFirstOrThrowArgs>(
			args?: SelectSubset<T, ChatMessageFindFirstOrThrowArgs<ExtArgs>>,
		): Prisma__ChatMessageClient<
			$Result.GetResult<
				Prisma.$ChatMessagePayload<ExtArgs>,
				T,
				"findFirstOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more ChatMessages that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ChatMessageFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all ChatMessages
		 * const chatMessages = await prisma.chatMessage.findMany()
		 *
		 * // Get first 10 ChatMessages
		 * const chatMessages = await prisma.chatMessage.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const chatMessageWithIdOnly = await prisma.chatMessage.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends ChatMessageFindManyArgs>(
			args?: SelectSubset<T, ChatMessageFindManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$ChatMessagePayload<ExtArgs>,
				T,
				"findMany",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create a ChatMessage.
		 * @param {ChatMessageCreateArgs} args - Arguments to create a ChatMessage.
		 * @example
		 * // Create one ChatMessage
		 * const ChatMessage = await prisma.chatMessage.create({
		 *   data: {
		 *     // ... data to create a ChatMessage
		 *   }
		 * })
		 *
		 */
		create<T extends ChatMessageCreateArgs>(
			args: SelectSubset<T, ChatMessageCreateArgs<ExtArgs>>,
		): Prisma__ChatMessageClient<
			$Result.GetResult<
				Prisma.$ChatMessagePayload<ExtArgs>,
				T,
				"create",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Create many ChatMessages.
		 * @param {ChatMessageCreateManyArgs} args - Arguments to create many ChatMessages.
		 * @example
		 * // Create many ChatMessages
		 * const chatMessage = await prisma.chatMessage.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends ChatMessageCreateManyArgs>(
			args?: SelectSubset<T, ChatMessageCreateManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many ChatMessages and returns the data saved in the database.
		 * @param {ChatMessageCreateManyAndReturnArgs} args - Arguments to create many ChatMessages.
		 * @example
		 * // Create many ChatMessages
		 * const chatMessage = await prisma.chatMessage.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many ChatMessages and only return the `id`
		 * const chatMessageWithIdOnly = await prisma.chatMessage.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends ChatMessageCreateManyAndReturnArgs>(
			args?: SelectSubset<T, ChatMessageCreateManyAndReturnArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$ChatMessagePayload<ExtArgs>,
				T,
				"createManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Delete a ChatMessage.
		 * @param {ChatMessageDeleteArgs} args - Arguments to delete one ChatMessage.
		 * @example
		 * // Delete one ChatMessage
		 * const ChatMessage = await prisma.chatMessage.delete({
		 *   where: {
		 *     // ... filter to delete one ChatMessage
		 *   }
		 * })
		 *
		 */
		delete<T extends ChatMessageDeleteArgs>(
			args: SelectSubset<T, ChatMessageDeleteArgs<ExtArgs>>,
		): Prisma__ChatMessageClient<
			$Result.GetResult<
				Prisma.$ChatMessagePayload<ExtArgs>,
				T,
				"delete",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Update one ChatMessage.
		 * @param {ChatMessageUpdateArgs} args - Arguments to update one ChatMessage.
		 * @example
		 * // Update one ChatMessage
		 * const chatMessage = await prisma.chatMessage.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends ChatMessageUpdateArgs>(
			args: SelectSubset<T, ChatMessageUpdateArgs<ExtArgs>>,
		): Prisma__ChatMessageClient<
			$Result.GetResult<
				Prisma.$ChatMessagePayload<ExtArgs>,
				T,
				"update",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Delete zero or more ChatMessages.
		 * @param {ChatMessageDeleteManyArgs} args - Arguments to filter ChatMessages to delete.
		 * @example
		 * // Delete a few ChatMessages
		 * const { count } = await prisma.chatMessage.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends ChatMessageDeleteManyArgs>(
			args?: SelectSubset<T, ChatMessageDeleteManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more ChatMessages.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ChatMessageUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many ChatMessages
		 * const chatMessage = await prisma.chatMessage.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends ChatMessageUpdateManyArgs>(
			args: SelectSubset<T, ChatMessageUpdateManyArgs<ExtArgs>>,
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more ChatMessages and returns the data updated in the database.
		 * @param {ChatMessageUpdateManyAndReturnArgs} args - Arguments to update many ChatMessages.
		 * @example
		 * // Update many ChatMessages
		 * const chatMessage = await prisma.chatMessage.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more ChatMessages and only return the `id`
		 * const chatMessageWithIdOnly = await prisma.chatMessage.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends ChatMessageUpdateManyAndReturnArgs>(
			args: SelectSubset<T, ChatMessageUpdateManyAndReturnArgs<ExtArgs>>,
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$ChatMessagePayload<ExtArgs>,
				T,
				"updateManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create or update one ChatMessage.
		 * @param {ChatMessageUpsertArgs} args - Arguments to update or create a ChatMessage.
		 * @example
		 * // Update or create a ChatMessage
		 * const chatMessage = await prisma.chatMessage.upsert({
		 *   create: {
		 *     // ... data to create a ChatMessage
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the ChatMessage we want to update
		 *   }
		 * })
		 */
		upsert<T extends ChatMessageUpsertArgs>(
			args: SelectSubset<T, ChatMessageUpsertArgs<ExtArgs>>,
		): Prisma__ChatMessageClient<
			$Result.GetResult<
				Prisma.$ChatMessagePayload<ExtArgs>,
				T,
				"upsert",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Count the number of ChatMessages.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ChatMessageCountArgs} args - Arguments to filter ChatMessages to count.
		 * @example
		 * // Count the number of ChatMessages
		 * const count = await prisma.chatMessage.count({
		 *   where: {
		 *     // ... the filter for the ChatMessages we want to count
		 *   }
		 * })
		 **/
		count<T extends ChatMessageCountArgs>(
			args?: Subset<T, ChatMessageCountArgs>,
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any>
				? T["select"] extends true
					? number
					: GetScalarType<T["select"], ChatMessageCountAggregateOutputType>
				: number
		>;

		/**
		 * Allows you to perform aggregations operations on a ChatMessage.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ChatMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends ChatMessageAggregateArgs>(
			args: Subset<T, ChatMessageAggregateArgs>,
		): Prisma.PrismaPromise<GetChatMessageAggregateType<T>>;

		/**
		 * Group by ChatMessage.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ChatMessageGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends ChatMessageGroupByArgs,
			HasSelectOrTake extends Or<
				Extends<"skip", Keys<T>>,
				Extends<"take", Keys<T>>
			>,
			OrderByArg extends True extends HasSelectOrTake
				? { orderBy: ChatMessageGroupByArgs["orderBy"] }
				: { orderBy?: ChatMessageGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<
				Keys<MaybeTupleToUnion<T["orderBy"]>>
			>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [
											Error,
											"Field ",
											P,
											` in "having" needs to be provided in "by"`,
										];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields
												? never
												: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, ChatMessageGroupByArgs, OrderByArg> &
				InputErrors,
		): {} extends InputErrors
			? GetChatMessageGroupByPayload<T>
			: Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the ChatMessage model
		 */
		readonly fields: ChatMessageFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for ChatMessage.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__ChatMessageClient<
		T,
		Null = never,
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		project<T extends ProjectDefaultArgs<ExtArgs> = {}>(
			args?: Subset<T, ProjectDefaultArgs<ExtArgs>>,
		): Prisma__ProjectClient<
			| $Result.GetResult<
					Prisma.$ProjectPayload<ExtArgs>,
					T,
					"findUniqueOrThrow",
					GlobalOmitOptions
			  >
			| Null,
			Null,
			ExtArgs,
			GlobalOmitOptions
		>;
		version<T extends ProjectVersionDefaultArgs<ExtArgs> = {}>(
			args?: Subset<T, ProjectVersionDefaultArgs<ExtArgs>>,
		): Prisma__ProjectVersionClient<
			| $Result.GetResult<
					Prisma.$ProjectVersionPayload<ExtArgs>,
					T,
					"findUniqueOrThrow",
					GlobalOmitOptions
			  >
			| Null,
			Null,
			ExtArgs,
			GlobalOmitOptions
		>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?:
				| ((value: T) => TResult1 | PromiseLike<TResult1>)
				| undefined
				| null,
			onrejected?:
				| ((reason: any) => TResult2 | PromiseLike<TResult2>)
				| undefined
				| null,
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(
			onrejected?:
				| ((reason: any) => TResult | PromiseLike<TResult>)
				| undefined
				| null,
		): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the ChatMessage model
	 */
	interface ChatMessageFieldRefs {
		readonly id: FieldRef<"ChatMessage", "String">;
		readonly projectId: FieldRef<"ChatMessage", "String">;
		readonly versionId: FieldRef<"ChatMessage", "String">;
		readonly role: FieldRef<"ChatMessage", "MessageRole">;
		readonly content: FieldRef<"ChatMessage", "String">;
		readonly fileChanges: FieldRef<"ChatMessage", "Json">;
		readonly createdAt: FieldRef<"ChatMessage", "DateTime">;
	}

	// Custom InputTypes
	/**
	 * ChatMessage findUnique
	 */
	export type ChatMessageFindUniqueArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ChatMessage
		 */
		select?: ChatMessageSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ChatMessage
		 */
		omit?: ChatMessageOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ChatMessageInclude<ExtArgs> | null;
		/**
		 * Filter, which ChatMessage to fetch.
		 */
		where: ChatMessageWhereUniqueInput;
	};

	/**
	 * ChatMessage findUniqueOrThrow
	 */
	export type ChatMessageFindUniqueOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ChatMessage
		 */
		select?: ChatMessageSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ChatMessage
		 */
		omit?: ChatMessageOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ChatMessageInclude<ExtArgs> | null;
		/**
		 * Filter, which ChatMessage to fetch.
		 */
		where: ChatMessageWhereUniqueInput;
	};

	/**
	 * ChatMessage findFirst
	 */
	export type ChatMessageFindFirstArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ChatMessage
		 */
		select?: ChatMessageSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ChatMessage
		 */
		omit?: ChatMessageOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ChatMessageInclude<ExtArgs> | null;
		/**
		 * Filter, which ChatMessage to fetch.
		 */
		where?: ChatMessageWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of ChatMessages to fetch.
		 */
		orderBy?:
			| ChatMessageOrderByWithRelationInput
			| ChatMessageOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for ChatMessages.
		 */
		cursor?: ChatMessageWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` ChatMessages from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` ChatMessages.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of ChatMessages.
		 */
		distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[];
	};

	/**
	 * ChatMessage findFirstOrThrow
	 */
	export type ChatMessageFindFirstOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ChatMessage
		 */
		select?: ChatMessageSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ChatMessage
		 */
		omit?: ChatMessageOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ChatMessageInclude<ExtArgs> | null;
		/**
		 * Filter, which ChatMessage to fetch.
		 */
		where?: ChatMessageWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of ChatMessages to fetch.
		 */
		orderBy?:
			| ChatMessageOrderByWithRelationInput
			| ChatMessageOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for ChatMessages.
		 */
		cursor?: ChatMessageWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` ChatMessages from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` ChatMessages.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of ChatMessages.
		 */
		distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[];
	};

	/**
	 * ChatMessage findMany
	 */
	export type ChatMessageFindManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ChatMessage
		 */
		select?: ChatMessageSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ChatMessage
		 */
		omit?: ChatMessageOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ChatMessageInclude<ExtArgs> | null;
		/**
		 * Filter, which ChatMessages to fetch.
		 */
		where?: ChatMessageWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of ChatMessages to fetch.
		 */
		orderBy?:
			| ChatMessageOrderByWithRelationInput
			| ChatMessageOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing ChatMessages.
		 */
		cursor?: ChatMessageWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` ChatMessages from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` ChatMessages.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of ChatMessages.
		 */
		distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[];
	};

	/**
	 * ChatMessage create
	 */
	export type ChatMessageCreateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ChatMessage
		 */
		select?: ChatMessageSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ChatMessage
		 */
		omit?: ChatMessageOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ChatMessageInclude<ExtArgs> | null;
		/**
		 * The data needed to create a ChatMessage.
		 */
		data: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>;
	};

	/**
	 * ChatMessage createMany
	 */
	export type ChatMessageCreateManyArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to create many ChatMessages.
		 */
		data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * ChatMessage createManyAndReturn
	 */
	export type ChatMessageCreateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ChatMessage
		 */
		select?: ChatMessageSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the ChatMessage
		 */
		omit?: ChatMessageOmit<ExtArgs> | null;
		/**
		 * The data used to create many ChatMessages.
		 */
		data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[];
		skipDuplicates?: boolean;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ChatMessageIncludeCreateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * ChatMessage update
	 */
	export type ChatMessageUpdateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ChatMessage
		 */
		select?: ChatMessageSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ChatMessage
		 */
		omit?: ChatMessageOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ChatMessageInclude<ExtArgs> | null;
		/**
		 * The data needed to update a ChatMessage.
		 */
		data: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>;
		/**
		 * Choose, which ChatMessage to update.
		 */
		where: ChatMessageWhereUniqueInput;
	};

	/**
	 * ChatMessage updateMany
	 */
	export type ChatMessageUpdateManyArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to update ChatMessages.
		 */
		data: XOR<
			ChatMessageUpdateManyMutationInput,
			ChatMessageUncheckedUpdateManyInput
		>;
		/**
		 * Filter which ChatMessages to update
		 */
		where?: ChatMessageWhereInput;
		/**
		 * Limit how many ChatMessages to update.
		 */
		limit?: number;
	};

	/**
	 * ChatMessage updateManyAndReturn
	 */
	export type ChatMessageUpdateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ChatMessage
		 */
		select?: ChatMessageSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the ChatMessage
		 */
		omit?: ChatMessageOmit<ExtArgs> | null;
		/**
		 * The data used to update ChatMessages.
		 */
		data: XOR<
			ChatMessageUpdateManyMutationInput,
			ChatMessageUncheckedUpdateManyInput
		>;
		/**
		 * Filter which ChatMessages to update
		 */
		where?: ChatMessageWhereInput;
		/**
		 * Limit how many ChatMessages to update.
		 */
		limit?: number;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ChatMessageIncludeUpdateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * ChatMessage upsert
	 */
	export type ChatMessageUpsertArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ChatMessage
		 */
		select?: ChatMessageSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ChatMessage
		 */
		omit?: ChatMessageOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ChatMessageInclude<ExtArgs> | null;
		/**
		 * The filter to search for the ChatMessage to update in case it exists.
		 */
		where: ChatMessageWhereUniqueInput;
		/**
		 * In case the ChatMessage found by the `where` argument doesn't exist, create a new ChatMessage with this data.
		 */
		create: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>;
		/**
		 * In case the ChatMessage was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>;
	};

	/**
	 * ChatMessage delete
	 */
	export type ChatMessageDeleteArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ChatMessage
		 */
		select?: ChatMessageSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ChatMessage
		 */
		omit?: ChatMessageOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ChatMessageInclude<ExtArgs> | null;
		/**
		 * Filter which ChatMessage to delete.
		 */
		where: ChatMessageWhereUniqueInput;
	};

	/**
	 * ChatMessage deleteMany
	 */
	export type ChatMessageDeleteManyArgs<
		_ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which ChatMessages to delete
		 */
		where?: ChatMessageWhereInput;
		/**
		 * Limit how many ChatMessages to delete.
		 */
		limit?: number;
	};

	/**
	 * ChatMessage without action
	 */
	export type ChatMessageDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ChatMessage
		 */
		select?: ChatMessageSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ChatMessage
		 */
		omit?: ChatMessageOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ChatMessageInclude<ExtArgs> | null;
	};

	/**
	 * Enums
	 */

	export const TransactionIsolationLevel: {
		ReadUncommitted: "ReadUncommitted";
		ReadCommitted: "ReadCommitted";
		RepeatableRead: "RepeatableRead";
		Serializable: "Serializable";
	};

	export type TransactionIsolationLevel =
		(typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

	export const UserScalarFieldEnum: {
		id: "id";
		email: "email";
		name: "name";
		createdAt: "createdAt";
		updatedAt: "updatedAt";
	};

	export type UserScalarFieldEnum =
		(typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];

	export const ProjectScalarFieldEnum: {
		id: "id";
		userId: "userId";
		name: "name";
		description: "description";
		status: "status";
		createdAt: "createdAt";
		updatedAt: "updatedAt";
	};

	export type ProjectScalarFieldEnum =
		(typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum];

	export const ProjectVersionScalarFieldEnum: {
		id: "id";
		projectId: "projectId";
		versionNumber: "versionNumber";
		label: "label";
		createdAt: "createdAt";
	};

	export type ProjectVersionScalarFieldEnum =
		(typeof ProjectVersionScalarFieldEnum)[keyof typeof ProjectVersionScalarFieldEnum];

	export const ProjectFileScalarFieldEnum: {
		id: "id";
		projectId: "projectId";
		versionId: "versionId";
		path: "path";
		content: "content";
		fileSource: "fileSource";
		updatedAt: "updatedAt";
	};

	export type ProjectFileScalarFieldEnum =
		(typeof ProjectFileScalarFieldEnum)[keyof typeof ProjectFileScalarFieldEnum];

	export const ChatMessageScalarFieldEnum: {
		id: "id";
		projectId: "projectId";
		versionId: "versionId";
		role: "role";
		content: "content";
		fileChanges: "fileChanges";
		createdAt: "createdAt";
	};

	export type ChatMessageScalarFieldEnum =
		(typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum];

	export const SortOrder: {
		asc: "asc";
		desc: "desc";
	};

	export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

	export const NullableJsonNullValueInput: {
		DbNull: typeof DbNull;
		JsonNull: typeof JsonNull;
	};

	export type NullableJsonNullValueInput =
		(typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];

	export const QueryMode: {
		default: "default";
		insensitive: "insensitive";
	};

	export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

	export const NullsOrder: {
		first: "first";
		last: "last";
	};

	export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

	export const JsonNullValueFilter: {
		DbNull: typeof DbNull;
		JsonNull: typeof JsonNull;
		AnyNull: typeof AnyNull;
	};

	export type JsonNullValueFilter =
		(typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];

	/**
	 * Field references
	 */

	/**
	 * Reference to a field of type 'String'
	 */
	export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"String"
	>;

	/**
	 * Reference to a field of type 'String[]'
	 */
	export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"String[]"
	>;

	/**
	 * Reference to a field of type 'DateTime'
	 */
	export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"DateTime"
	>;

	/**
	 * Reference to a field of type 'DateTime[]'
	 */
	export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"DateTime[]"
	>;

	/**
	 * Reference to a field of type 'ProjectStatus'
	 */
	export type EnumProjectStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"ProjectStatus"
	>;

	/**
	 * Reference to a field of type 'ProjectStatus[]'
	 */
	export type ListEnumProjectStatusFieldRefInput<$PrismaModel> =
		FieldRefInputType<$PrismaModel, "ProjectStatus[]">;

	/**
	 * Reference to a field of type 'Int'
	 */
	export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"Int"
	>;

	/**
	 * Reference to a field of type 'Int[]'
	 */
	export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"Int[]"
	>;

	/**
	 * Reference to a field of type 'FileSource'
	 */
	export type EnumFileSourceFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"FileSource"
	>;

	/**
	 * Reference to a field of type 'FileSource[]'
	 */
	export type ListEnumFileSourceFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"FileSource[]"
	>;

	/**
	 * Reference to a field of type 'MessageRole'
	 */
	export type EnumMessageRoleFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"MessageRole"
	>;

	/**
	 * Reference to a field of type 'MessageRole[]'
	 */
	export type ListEnumMessageRoleFieldRefInput<$PrismaModel> =
		FieldRefInputType<$PrismaModel, "MessageRole[]">;

	/**
	 * Reference to a field of type 'Json'
	 */
	export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"Json"
	>;

	/**
	 * Reference to a field of type 'QueryMode'
	 */
	export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"QueryMode"
	>;

	/**
	 * Reference to a field of type 'Float'
	 */
	export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"Float"
	>;

	/**
	 * Reference to a field of type 'Float[]'
	 */
	export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"Float[]"
	>;

	/**
	 * Deep Input Types
	 */

	export type UserWhereInput = {
		AND?: UserWhereInput | UserWhereInput[];
		OR?: UserWhereInput[];
		NOT?: UserWhereInput | UserWhereInput[];
		id?: StringFilter<"User"> | string;
		email?: StringFilter<"User"> | string;
		name?: StringNullableFilter<"User"> | string | null;
		createdAt?: DateTimeFilter<"User"> | Date | string;
		updatedAt?: DateTimeFilter<"User"> | Date | string;
		projects?: ProjectListRelationFilter;
	};

	export type UserOrderByWithRelationInput = {
		id?: SortOrder;
		email?: SortOrder;
		name?: SortOrderInput | SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		projects?: ProjectOrderByRelationAggregateInput;
	};

	export type UserWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			email?: string;
			AND?: UserWhereInput | UserWhereInput[];
			OR?: UserWhereInput[];
			NOT?: UserWhereInput | UserWhereInput[];
			name?: StringNullableFilter<"User"> | string | null;
			createdAt?: DateTimeFilter<"User"> | Date | string;
			updatedAt?: DateTimeFilter<"User"> | Date | string;
			projects?: ProjectListRelationFilter;
		},
		"id" | "email"
	>;

	export type UserOrderByWithAggregationInput = {
		id?: SortOrder;
		email?: SortOrder;
		name?: SortOrderInput | SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		_count?: UserCountOrderByAggregateInput;
		_max?: UserMaxOrderByAggregateInput;
		_min?: UserMinOrderByAggregateInput;
	};

	export type UserScalarWhereWithAggregatesInput = {
		AND?:
			| UserScalarWhereWithAggregatesInput
			| UserScalarWhereWithAggregatesInput[];
		OR?: UserScalarWhereWithAggregatesInput[];
		NOT?:
			| UserScalarWhereWithAggregatesInput
			| UserScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"User"> | string;
		email?: StringWithAggregatesFilter<"User"> | string;
		name?: StringNullableWithAggregatesFilter<"User"> | string | null;
		createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string;
		updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string;
	};

	export type ProjectWhereInput = {
		AND?: ProjectWhereInput | ProjectWhereInput[];
		OR?: ProjectWhereInput[];
		NOT?: ProjectWhereInput | ProjectWhereInput[];
		id?: StringFilter<"Project"> | string;
		userId?: StringFilter<"Project"> | string;
		name?: StringFilter<"Project"> | string;
		description?: StringFilter<"Project"> | string;
		status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus;
		createdAt?: DateTimeFilter<"Project"> | Date | string;
		updatedAt?: DateTimeFilter<"Project"> | Date | string;
		user?: XOR<UserScalarRelationFilter, UserWhereInput>;
		versions?: ProjectVersionListRelationFilter;
		files?: ProjectFileListRelationFilter;
		chatMessages?: ChatMessageListRelationFilter;
	};

	export type ProjectOrderByWithRelationInput = {
		id?: SortOrder;
		userId?: SortOrder;
		name?: SortOrder;
		description?: SortOrder;
		status?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		user?: UserOrderByWithRelationInput;
		versions?: ProjectVersionOrderByRelationAggregateInput;
		files?: ProjectFileOrderByRelationAggregateInput;
		chatMessages?: ChatMessageOrderByRelationAggregateInput;
	};

	export type ProjectWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			AND?: ProjectWhereInput | ProjectWhereInput[];
			OR?: ProjectWhereInput[];
			NOT?: ProjectWhereInput | ProjectWhereInput[];
			userId?: StringFilter<"Project"> | string;
			name?: StringFilter<"Project"> | string;
			description?: StringFilter<"Project"> | string;
			status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus;
			createdAt?: DateTimeFilter<"Project"> | Date | string;
			updatedAt?: DateTimeFilter<"Project"> | Date | string;
			user?: XOR<UserScalarRelationFilter, UserWhereInput>;
			versions?: ProjectVersionListRelationFilter;
			files?: ProjectFileListRelationFilter;
			chatMessages?: ChatMessageListRelationFilter;
		},
		"id"
	>;

	export type ProjectOrderByWithAggregationInput = {
		id?: SortOrder;
		userId?: SortOrder;
		name?: SortOrder;
		description?: SortOrder;
		status?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		_count?: ProjectCountOrderByAggregateInput;
		_max?: ProjectMaxOrderByAggregateInput;
		_min?: ProjectMinOrderByAggregateInput;
	};

	export type ProjectScalarWhereWithAggregatesInput = {
		AND?:
			| ProjectScalarWhereWithAggregatesInput
			| ProjectScalarWhereWithAggregatesInput[];
		OR?: ProjectScalarWhereWithAggregatesInput[];
		NOT?:
			| ProjectScalarWhereWithAggregatesInput
			| ProjectScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"Project"> | string;
		userId?: StringWithAggregatesFilter<"Project"> | string;
		name?: StringWithAggregatesFilter<"Project"> | string;
		description?: StringWithAggregatesFilter<"Project"> | string;
		status?:
			| EnumProjectStatusWithAggregatesFilter<"Project">
			| $Enums.ProjectStatus;
		createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string;
		updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string;
	};

	export type ProjectVersionWhereInput = {
		AND?: ProjectVersionWhereInput | ProjectVersionWhereInput[];
		OR?: ProjectVersionWhereInput[];
		NOT?: ProjectVersionWhereInput | ProjectVersionWhereInput[];
		id?: StringFilter<"ProjectVersion"> | string;
		projectId?: StringFilter<"ProjectVersion"> | string;
		versionNumber?: IntFilter<"ProjectVersion"> | number;
		label?: StringNullableFilter<"ProjectVersion"> | string | null;
		createdAt?: DateTimeFilter<"ProjectVersion"> | Date | string;
		project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>;
		files?: ProjectFileListRelationFilter;
		chatMessages?: ChatMessageListRelationFilter;
	};

	export type ProjectVersionOrderByWithRelationInput = {
		id?: SortOrder;
		projectId?: SortOrder;
		versionNumber?: SortOrder;
		label?: SortOrderInput | SortOrder;
		createdAt?: SortOrder;
		project?: ProjectOrderByWithRelationInput;
		files?: ProjectFileOrderByRelationAggregateInput;
		chatMessages?: ChatMessageOrderByRelationAggregateInput;
	};

	export type ProjectVersionWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			projectId_versionNumber?: ProjectVersionProjectIdVersionNumberCompoundUniqueInput;
			AND?: ProjectVersionWhereInput | ProjectVersionWhereInput[];
			OR?: ProjectVersionWhereInput[];
			NOT?: ProjectVersionWhereInput | ProjectVersionWhereInput[];
			projectId?: StringFilter<"ProjectVersion"> | string;
			versionNumber?: IntFilter<"ProjectVersion"> | number;
			label?: StringNullableFilter<"ProjectVersion"> | string | null;
			createdAt?: DateTimeFilter<"ProjectVersion"> | Date | string;
			project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>;
			files?: ProjectFileListRelationFilter;
			chatMessages?: ChatMessageListRelationFilter;
		},
		"id" | "projectId_versionNumber"
	>;

	export type ProjectVersionOrderByWithAggregationInput = {
		id?: SortOrder;
		projectId?: SortOrder;
		versionNumber?: SortOrder;
		label?: SortOrderInput | SortOrder;
		createdAt?: SortOrder;
		_count?: ProjectVersionCountOrderByAggregateInput;
		_avg?: ProjectVersionAvgOrderByAggregateInput;
		_max?: ProjectVersionMaxOrderByAggregateInput;
		_min?: ProjectVersionMinOrderByAggregateInput;
		_sum?: ProjectVersionSumOrderByAggregateInput;
	};

	export type ProjectVersionScalarWhereWithAggregatesInput = {
		AND?:
			| ProjectVersionScalarWhereWithAggregatesInput
			| ProjectVersionScalarWhereWithAggregatesInput[];
		OR?: ProjectVersionScalarWhereWithAggregatesInput[];
		NOT?:
			| ProjectVersionScalarWhereWithAggregatesInput
			| ProjectVersionScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"ProjectVersion"> | string;
		projectId?: StringWithAggregatesFilter<"ProjectVersion"> | string;
		versionNumber?: IntWithAggregatesFilter<"ProjectVersion"> | number;
		label?:
			| StringNullableWithAggregatesFilter<"ProjectVersion">
			| string
			| null;
		createdAt?: DateTimeWithAggregatesFilter<"ProjectVersion"> | Date | string;
	};

	export type ProjectFileWhereInput = {
		AND?: ProjectFileWhereInput | ProjectFileWhereInput[];
		OR?: ProjectFileWhereInput[];
		NOT?: ProjectFileWhereInput | ProjectFileWhereInput[];
		id?: StringFilter<"ProjectFile"> | string;
		projectId?: StringFilter<"ProjectFile"> | string;
		versionId?: StringFilter<"ProjectFile"> | string;
		path?: StringFilter<"ProjectFile"> | string;
		content?: StringFilter<"ProjectFile"> | string;
		fileSource?: EnumFileSourceFilter<"ProjectFile"> | $Enums.FileSource;
		updatedAt?: DateTimeFilter<"ProjectFile"> | Date | string;
		project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>;
		version?: XOR<ProjectVersionScalarRelationFilter, ProjectVersionWhereInput>;
	};

	export type ProjectFileOrderByWithRelationInput = {
		id?: SortOrder;
		projectId?: SortOrder;
		versionId?: SortOrder;
		path?: SortOrder;
		content?: SortOrder;
		fileSource?: SortOrder;
		updatedAt?: SortOrder;
		project?: ProjectOrderByWithRelationInput;
		version?: ProjectVersionOrderByWithRelationInput;
	};

	export type ProjectFileWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			versionId_path?: ProjectFileVersionIdPathCompoundUniqueInput;
			AND?: ProjectFileWhereInput | ProjectFileWhereInput[];
			OR?: ProjectFileWhereInput[];
			NOT?: ProjectFileWhereInput | ProjectFileWhereInput[];
			projectId?: StringFilter<"ProjectFile"> | string;
			versionId?: StringFilter<"ProjectFile"> | string;
			path?: StringFilter<"ProjectFile"> | string;
			content?: StringFilter<"ProjectFile"> | string;
			fileSource?: EnumFileSourceFilter<"ProjectFile"> | $Enums.FileSource;
			updatedAt?: DateTimeFilter<"ProjectFile"> | Date | string;
			project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>;
			version?: XOR<
				ProjectVersionScalarRelationFilter,
				ProjectVersionWhereInput
			>;
		},
		"id" | "versionId_path"
	>;

	export type ProjectFileOrderByWithAggregationInput = {
		id?: SortOrder;
		projectId?: SortOrder;
		versionId?: SortOrder;
		path?: SortOrder;
		content?: SortOrder;
		fileSource?: SortOrder;
		updatedAt?: SortOrder;
		_count?: ProjectFileCountOrderByAggregateInput;
		_max?: ProjectFileMaxOrderByAggregateInput;
		_min?: ProjectFileMinOrderByAggregateInput;
	};

	export type ProjectFileScalarWhereWithAggregatesInput = {
		AND?:
			| ProjectFileScalarWhereWithAggregatesInput
			| ProjectFileScalarWhereWithAggregatesInput[];
		OR?: ProjectFileScalarWhereWithAggregatesInput[];
		NOT?:
			| ProjectFileScalarWhereWithAggregatesInput
			| ProjectFileScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"ProjectFile"> | string;
		projectId?: StringWithAggregatesFilter<"ProjectFile"> | string;
		versionId?: StringWithAggregatesFilter<"ProjectFile"> | string;
		path?: StringWithAggregatesFilter<"ProjectFile"> | string;
		content?: StringWithAggregatesFilter<"ProjectFile"> | string;
		fileSource?:
			| EnumFileSourceWithAggregatesFilter<"ProjectFile">
			| $Enums.FileSource;
		updatedAt?: DateTimeWithAggregatesFilter<"ProjectFile"> | Date | string;
	};

	export type ChatMessageWhereInput = {
		AND?: ChatMessageWhereInput | ChatMessageWhereInput[];
		OR?: ChatMessageWhereInput[];
		NOT?: ChatMessageWhereInput | ChatMessageWhereInput[];
		id?: StringFilter<"ChatMessage"> | string;
		projectId?: StringFilter<"ChatMessage"> | string;
		versionId?: StringFilter<"ChatMessage"> | string;
		role?: EnumMessageRoleFilter<"ChatMessage"> | $Enums.MessageRole;
		content?: StringFilter<"ChatMessage"> | string;
		fileChanges?: JsonNullableFilter<"ChatMessage">;
		createdAt?: DateTimeFilter<"ChatMessage"> | Date | string;
		project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>;
		version?: XOR<ProjectVersionScalarRelationFilter, ProjectVersionWhereInput>;
	};

	export type ChatMessageOrderByWithRelationInput = {
		id?: SortOrder;
		projectId?: SortOrder;
		versionId?: SortOrder;
		role?: SortOrder;
		content?: SortOrder;
		fileChanges?: SortOrderInput | SortOrder;
		createdAt?: SortOrder;
		project?: ProjectOrderByWithRelationInput;
		version?: ProjectVersionOrderByWithRelationInput;
	};

	export type ChatMessageWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			AND?: ChatMessageWhereInput | ChatMessageWhereInput[];
			OR?: ChatMessageWhereInput[];
			NOT?: ChatMessageWhereInput | ChatMessageWhereInput[];
			projectId?: StringFilter<"ChatMessage"> | string;
			versionId?: StringFilter<"ChatMessage"> | string;
			role?: EnumMessageRoleFilter<"ChatMessage"> | $Enums.MessageRole;
			content?: StringFilter<"ChatMessage"> | string;
			fileChanges?: JsonNullableFilter<"ChatMessage">;
			createdAt?: DateTimeFilter<"ChatMessage"> | Date | string;
			project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>;
			version?: XOR<
				ProjectVersionScalarRelationFilter,
				ProjectVersionWhereInput
			>;
		},
		"id"
	>;

	export type ChatMessageOrderByWithAggregationInput = {
		id?: SortOrder;
		projectId?: SortOrder;
		versionId?: SortOrder;
		role?: SortOrder;
		content?: SortOrder;
		fileChanges?: SortOrderInput | SortOrder;
		createdAt?: SortOrder;
		_count?: ChatMessageCountOrderByAggregateInput;
		_max?: ChatMessageMaxOrderByAggregateInput;
		_min?: ChatMessageMinOrderByAggregateInput;
	};

	export type ChatMessageScalarWhereWithAggregatesInput = {
		AND?:
			| ChatMessageScalarWhereWithAggregatesInput
			| ChatMessageScalarWhereWithAggregatesInput[];
		OR?: ChatMessageScalarWhereWithAggregatesInput[];
		NOT?:
			| ChatMessageScalarWhereWithAggregatesInput
			| ChatMessageScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"ChatMessage"> | string;
		projectId?: StringWithAggregatesFilter<"ChatMessage"> | string;
		versionId?: StringWithAggregatesFilter<"ChatMessage"> | string;
		role?:
			| EnumMessageRoleWithAggregatesFilter<"ChatMessage">
			| $Enums.MessageRole;
		content?: StringWithAggregatesFilter<"ChatMessage"> | string;
		fileChanges?: JsonNullableWithAggregatesFilter<"ChatMessage">;
		createdAt?: DateTimeWithAggregatesFilter<"ChatMessage"> | Date | string;
	};

	export type UserCreateInput = {
		id?: string;
		email: string;
		name?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		projects?: ProjectCreateNestedManyWithoutUserInput;
	};

	export type UserUncheckedCreateInput = {
		id?: string;
		email: string;
		name?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		projects?: ProjectUncheckedCreateNestedManyWithoutUserInput;
	};

	export type UserUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		projects?: ProjectUpdateManyWithoutUserNestedInput;
	};

	export type UserUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput;
	};

	export type UserCreateManyInput = {
		id?: string;
		email: string;
		name?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type UserUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type UserUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ProjectCreateInput = {
		id?: string;
		name: string;
		description: string;
		status?: $Enums.ProjectStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		user: UserCreateNestedOneWithoutProjectsInput;
		versions?: ProjectVersionCreateNestedManyWithoutProjectInput;
		files?: ProjectFileCreateNestedManyWithoutProjectInput;
		chatMessages?: ChatMessageCreateNestedManyWithoutProjectInput;
	};

	export type ProjectUncheckedCreateInput = {
		id?: string;
		userId: string;
		name: string;
		description: string;
		status?: $Enums.ProjectStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		versions?: ProjectVersionUncheckedCreateNestedManyWithoutProjectInput;
		files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput;
		chatMessages?: ChatMessageUncheckedCreateNestedManyWithoutProjectInput;
	};

	export type ProjectUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		user?: UserUpdateOneRequiredWithoutProjectsNestedInput;
		versions?: ProjectVersionUpdateManyWithoutProjectNestedInput;
		files?: ProjectFileUpdateManyWithoutProjectNestedInput;
		chatMessages?: ChatMessageUpdateManyWithoutProjectNestedInput;
	};

	export type ProjectUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		versions?: ProjectVersionUncheckedUpdateManyWithoutProjectNestedInput;
		files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput;
		chatMessages?: ChatMessageUncheckedUpdateManyWithoutProjectNestedInput;
	};

	export type ProjectCreateManyInput = {
		id?: string;
		userId: string;
		name: string;
		description: string;
		status?: $Enums.ProjectStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type ProjectUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ProjectUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ProjectVersionCreateInput = {
		id?: string;
		versionNumber: number;
		label?: string | null;
		createdAt?: Date | string;
		project: ProjectCreateNestedOneWithoutVersionsInput;
		files?: ProjectFileCreateNestedManyWithoutVersionInput;
		chatMessages?: ChatMessageCreateNestedManyWithoutVersionInput;
	};

	export type ProjectVersionUncheckedCreateInput = {
		id?: string;
		projectId: string;
		versionNumber: number;
		label?: string | null;
		createdAt?: Date | string;
		files?: ProjectFileUncheckedCreateNestedManyWithoutVersionInput;
		chatMessages?: ChatMessageUncheckedCreateNestedManyWithoutVersionInput;
	};

	export type ProjectVersionUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		versionNumber?: IntFieldUpdateOperationsInput | number;
		label?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		project?: ProjectUpdateOneRequiredWithoutVersionsNestedInput;
		files?: ProjectFileUpdateManyWithoutVersionNestedInput;
		chatMessages?: ChatMessageUpdateManyWithoutVersionNestedInput;
	};

	export type ProjectVersionUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		projectId?: StringFieldUpdateOperationsInput | string;
		versionNumber?: IntFieldUpdateOperationsInput | number;
		label?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		files?: ProjectFileUncheckedUpdateManyWithoutVersionNestedInput;
		chatMessages?: ChatMessageUncheckedUpdateManyWithoutVersionNestedInput;
	};

	export type ProjectVersionCreateManyInput = {
		id?: string;
		projectId: string;
		versionNumber: number;
		label?: string | null;
		createdAt?: Date | string;
	};

	export type ProjectVersionUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		versionNumber?: IntFieldUpdateOperationsInput | number;
		label?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ProjectVersionUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		projectId?: StringFieldUpdateOperationsInput | string;
		versionNumber?: IntFieldUpdateOperationsInput | number;
		label?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ProjectFileCreateInput = {
		id?: string;
		path: string;
		content: string;
		fileSource?: $Enums.FileSource;
		updatedAt?: Date | string;
		project: ProjectCreateNestedOneWithoutFilesInput;
		version: ProjectVersionCreateNestedOneWithoutFilesInput;
	};

	export type ProjectFileUncheckedCreateInput = {
		id?: string;
		projectId: string;
		versionId: string;
		path: string;
		content: string;
		fileSource?: $Enums.FileSource;
		updatedAt?: Date | string;
	};

	export type ProjectFileUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		path?: StringFieldUpdateOperationsInput | string;
		content?: StringFieldUpdateOperationsInput | string;
		fileSource?: EnumFileSourceFieldUpdateOperationsInput | $Enums.FileSource;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		project?: ProjectUpdateOneRequiredWithoutFilesNestedInput;
		version?: ProjectVersionUpdateOneRequiredWithoutFilesNestedInput;
	};

	export type ProjectFileUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		projectId?: StringFieldUpdateOperationsInput | string;
		versionId?: StringFieldUpdateOperationsInput | string;
		path?: StringFieldUpdateOperationsInput | string;
		content?: StringFieldUpdateOperationsInput | string;
		fileSource?: EnumFileSourceFieldUpdateOperationsInput | $Enums.FileSource;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ProjectFileCreateManyInput = {
		id?: string;
		projectId: string;
		versionId: string;
		path: string;
		content: string;
		fileSource?: $Enums.FileSource;
		updatedAt?: Date | string;
	};

	export type ProjectFileUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		path?: StringFieldUpdateOperationsInput | string;
		content?: StringFieldUpdateOperationsInput | string;
		fileSource?: EnumFileSourceFieldUpdateOperationsInput | $Enums.FileSource;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ProjectFileUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		projectId?: StringFieldUpdateOperationsInput | string;
		versionId?: StringFieldUpdateOperationsInput | string;
		path?: StringFieldUpdateOperationsInput | string;
		content?: StringFieldUpdateOperationsInput | string;
		fileSource?: EnumFileSourceFieldUpdateOperationsInput | $Enums.FileSource;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ChatMessageCreateInput = {
		id?: string;
		role: $Enums.MessageRole;
		content: string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: Date | string;
		project: ProjectCreateNestedOneWithoutChatMessagesInput;
		version: ProjectVersionCreateNestedOneWithoutChatMessagesInput;
	};

	export type ChatMessageUncheckedCreateInput = {
		id?: string;
		projectId: string;
		versionId: string;
		role: $Enums.MessageRole;
		content: string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: Date | string;
	};

	export type ChatMessageUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole;
		content?: StringFieldUpdateOperationsInput | string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		project?: ProjectUpdateOneRequiredWithoutChatMessagesNestedInput;
		version?: ProjectVersionUpdateOneRequiredWithoutChatMessagesNestedInput;
	};

	export type ChatMessageUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		projectId?: StringFieldUpdateOperationsInput | string;
		versionId?: StringFieldUpdateOperationsInput | string;
		role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole;
		content?: StringFieldUpdateOperationsInput | string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ChatMessageCreateManyInput = {
		id?: string;
		projectId: string;
		versionId: string;
		role: $Enums.MessageRole;
		content: string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: Date | string;
	};

	export type ChatMessageUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole;
		content?: StringFieldUpdateOperationsInput | string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ChatMessageUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		projectId?: StringFieldUpdateOperationsInput | string;
		versionId?: StringFieldUpdateOperationsInput | string;
		role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole;
		content?: StringFieldUpdateOperationsInput | string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type StringFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel>;
		in?: string[] | ListStringFieldRefInput<$PrismaModel>;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		mode?: QueryMode;
		not?: NestedStringFilter<$PrismaModel> | string;
	};

	export type StringNullableFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel> | null;
		in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		mode?: QueryMode;
		not?: NestedStringNullableFilter<$PrismaModel> | string | null;
	};

	export type DateTimeFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
	};

	export type ProjectListRelationFilter = {
		every?: ProjectWhereInput;
		some?: ProjectWhereInput;
		none?: ProjectWhereInput;
	};

	export type SortOrderInput = {
		sort: SortOrder;
		nulls?: NullsOrder;
	};

	export type ProjectOrderByRelationAggregateInput = {
		_count?: SortOrder;
	};

	export type UserCountOrderByAggregateInput = {
		id?: SortOrder;
		email?: SortOrder;
		name?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type UserMaxOrderByAggregateInput = {
		id?: SortOrder;
		email?: SortOrder;
		name?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type UserMinOrderByAggregateInput = {
		id?: SortOrder;
		email?: SortOrder;
		name?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type StringWithAggregatesFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel>;
		in?: string[] | ListStringFieldRefInput<$PrismaModel>;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		mode?: QueryMode;
		not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedStringFilter<$PrismaModel>;
		_max?: NestedStringFilter<$PrismaModel>;
	};

	export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel> | null;
		in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		mode?: QueryMode;
		not?:
			| NestedStringNullableWithAggregatesFilter<$PrismaModel>
			| string
			| null;
		_count?: NestedIntNullableFilter<$PrismaModel>;
		_min?: NestedStringNullableFilter<$PrismaModel>;
		_max?: NestedStringNullableFilter<$PrismaModel>;
	};

	export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedDateTimeFilter<$PrismaModel>;
		_max?: NestedDateTimeFilter<$PrismaModel>;
	};

	export type EnumProjectStatusFilter<$PrismaModel = never> = {
		equals?:
			| $Enums.ProjectStatus
			| EnumProjectStatusFieldRefInput<$PrismaModel>;
		in?:
			| $Enums.ProjectStatus[]
			| ListEnumProjectStatusFieldRefInput<$PrismaModel>;
		notIn?:
			| $Enums.ProjectStatus[]
			| ListEnumProjectStatusFieldRefInput<$PrismaModel>;
		not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus;
	};

	export type UserScalarRelationFilter = {
		is?: UserWhereInput;
		isNot?: UserWhereInput;
	};

	export type ProjectVersionListRelationFilter = {
		every?: ProjectVersionWhereInput;
		some?: ProjectVersionWhereInput;
		none?: ProjectVersionWhereInput;
	};

	export type ProjectFileListRelationFilter = {
		every?: ProjectFileWhereInput;
		some?: ProjectFileWhereInput;
		none?: ProjectFileWhereInput;
	};

	export type ChatMessageListRelationFilter = {
		every?: ChatMessageWhereInput;
		some?: ChatMessageWhereInput;
		none?: ChatMessageWhereInput;
	};

	export type ProjectVersionOrderByRelationAggregateInput = {
		_count?: SortOrder;
	};

	export type ProjectFileOrderByRelationAggregateInput = {
		_count?: SortOrder;
	};

	export type ChatMessageOrderByRelationAggregateInput = {
		_count?: SortOrder;
	};

	export type ProjectCountOrderByAggregateInput = {
		id?: SortOrder;
		userId?: SortOrder;
		name?: SortOrder;
		description?: SortOrder;
		status?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type ProjectMaxOrderByAggregateInput = {
		id?: SortOrder;
		userId?: SortOrder;
		name?: SortOrder;
		description?: SortOrder;
		status?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type ProjectMinOrderByAggregateInput = {
		id?: SortOrder;
		userId?: SortOrder;
		name?: SortOrder;
		description?: SortOrder;
		status?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type EnumProjectStatusWithAggregatesFilter<$PrismaModel = never> = {
		equals?:
			| $Enums.ProjectStatus
			| EnumProjectStatusFieldRefInput<$PrismaModel>;
		in?:
			| $Enums.ProjectStatus[]
			| ListEnumProjectStatusFieldRefInput<$PrismaModel>;
		notIn?:
			| $Enums.ProjectStatus[]
			| ListEnumProjectStatusFieldRefInput<$PrismaModel>;
		not?:
			| NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel>
			| $Enums.ProjectStatus;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumProjectStatusFilter<$PrismaModel>;
		_max?: NestedEnumProjectStatusFilter<$PrismaModel>;
	};

	export type IntFilter<$PrismaModel = never> = {
		equals?: number | IntFieldRefInput<$PrismaModel>;
		in?: number[] | ListIntFieldRefInput<$PrismaModel>;
		notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
		lt?: number | IntFieldRefInput<$PrismaModel>;
		lte?: number | IntFieldRefInput<$PrismaModel>;
		gt?: number | IntFieldRefInput<$PrismaModel>;
		gte?: number | IntFieldRefInput<$PrismaModel>;
		not?: NestedIntFilter<$PrismaModel> | number;
	};

	export type ProjectScalarRelationFilter = {
		is?: ProjectWhereInput;
		isNot?: ProjectWhereInput;
	};

	export type ProjectVersionProjectIdVersionNumberCompoundUniqueInput = {
		projectId: string;
		versionNumber: number;
	};

	export type ProjectVersionCountOrderByAggregateInput = {
		id?: SortOrder;
		projectId?: SortOrder;
		versionNumber?: SortOrder;
		label?: SortOrder;
		createdAt?: SortOrder;
	};

	export type ProjectVersionAvgOrderByAggregateInput = {
		versionNumber?: SortOrder;
	};

	export type ProjectVersionMaxOrderByAggregateInput = {
		id?: SortOrder;
		projectId?: SortOrder;
		versionNumber?: SortOrder;
		label?: SortOrder;
		createdAt?: SortOrder;
	};

	export type ProjectVersionMinOrderByAggregateInput = {
		id?: SortOrder;
		projectId?: SortOrder;
		versionNumber?: SortOrder;
		label?: SortOrder;
		createdAt?: SortOrder;
	};

	export type ProjectVersionSumOrderByAggregateInput = {
		versionNumber?: SortOrder;
	};

	export type IntWithAggregatesFilter<$PrismaModel = never> = {
		equals?: number | IntFieldRefInput<$PrismaModel>;
		in?: number[] | ListIntFieldRefInput<$PrismaModel>;
		notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
		lt?: number | IntFieldRefInput<$PrismaModel>;
		lte?: number | IntFieldRefInput<$PrismaModel>;
		gt?: number | IntFieldRefInput<$PrismaModel>;
		gte?: number | IntFieldRefInput<$PrismaModel>;
		not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
		_count?: NestedIntFilter<$PrismaModel>;
		_avg?: NestedFloatFilter<$PrismaModel>;
		_sum?: NestedIntFilter<$PrismaModel>;
		_min?: NestedIntFilter<$PrismaModel>;
		_max?: NestedIntFilter<$PrismaModel>;
	};

	export type EnumFileSourceFilter<$PrismaModel = never> = {
		equals?: $Enums.FileSource | EnumFileSourceFieldRefInput<$PrismaModel>;
		in?: $Enums.FileSource[] | ListEnumFileSourceFieldRefInput<$PrismaModel>;
		notIn?: $Enums.FileSource[] | ListEnumFileSourceFieldRefInput<$PrismaModel>;
		not?: NestedEnumFileSourceFilter<$PrismaModel> | $Enums.FileSource;
	};

	export type ProjectVersionScalarRelationFilter = {
		is?: ProjectVersionWhereInput;
		isNot?: ProjectVersionWhereInput;
	};

	export type ProjectFileVersionIdPathCompoundUniqueInput = {
		versionId: string;
		path: string;
	};

	export type ProjectFileCountOrderByAggregateInput = {
		id?: SortOrder;
		projectId?: SortOrder;
		versionId?: SortOrder;
		path?: SortOrder;
		content?: SortOrder;
		fileSource?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type ProjectFileMaxOrderByAggregateInput = {
		id?: SortOrder;
		projectId?: SortOrder;
		versionId?: SortOrder;
		path?: SortOrder;
		content?: SortOrder;
		fileSource?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type ProjectFileMinOrderByAggregateInput = {
		id?: SortOrder;
		projectId?: SortOrder;
		versionId?: SortOrder;
		path?: SortOrder;
		content?: SortOrder;
		fileSource?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type EnumFileSourceWithAggregatesFilter<$PrismaModel = never> = {
		equals?: $Enums.FileSource | EnumFileSourceFieldRefInput<$PrismaModel>;
		in?: $Enums.FileSource[] | ListEnumFileSourceFieldRefInput<$PrismaModel>;
		notIn?: $Enums.FileSource[] | ListEnumFileSourceFieldRefInput<$PrismaModel>;
		not?:
			| NestedEnumFileSourceWithAggregatesFilter<$PrismaModel>
			| $Enums.FileSource;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumFileSourceFilter<$PrismaModel>;
		_max?: NestedEnumFileSourceFilter<$PrismaModel>;
	};

	export type EnumMessageRoleFilter<$PrismaModel = never> = {
		equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>;
		in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>;
		notIn?:
			| $Enums.MessageRole[]
			| ListEnumMessageRoleFieldRefInput<$PrismaModel>;
		not?: NestedEnumMessageRoleFilter<$PrismaModel> | $Enums.MessageRole;
	};
	export type JsonNullableFilter<$PrismaModel = never> =
		| PatchUndefined<
				Either<
					Required<JsonNullableFilterBase<$PrismaModel>>,
					Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, "path">
				>,
				Required<JsonNullableFilterBase<$PrismaModel>>
		  >
		| OptionalFlat<
				Omit<Required<JsonNullableFilterBase<$PrismaModel>>, "path">
		  >;

	export type JsonNullableFilterBase<$PrismaModel = never> = {
		equals?:
			| InputJsonValue
			| JsonFieldRefInput<$PrismaModel>
			| JsonNullValueFilter;
		path?: string[];
		mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
		string_contains?: string | StringFieldRefInput<$PrismaModel>;
		string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
		string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
		array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
		array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
		array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
		lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
		lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
		gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
		gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
		not?:
			| InputJsonValue
			| JsonFieldRefInput<$PrismaModel>
			| JsonNullValueFilter;
	};

	export type ChatMessageCountOrderByAggregateInput = {
		id?: SortOrder;
		projectId?: SortOrder;
		versionId?: SortOrder;
		role?: SortOrder;
		content?: SortOrder;
		fileChanges?: SortOrder;
		createdAt?: SortOrder;
	};

	export type ChatMessageMaxOrderByAggregateInput = {
		id?: SortOrder;
		projectId?: SortOrder;
		versionId?: SortOrder;
		role?: SortOrder;
		content?: SortOrder;
		createdAt?: SortOrder;
	};

	export type ChatMessageMinOrderByAggregateInput = {
		id?: SortOrder;
		projectId?: SortOrder;
		versionId?: SortOrder;
		role?: SortOrder;
		content?: SortOrder;
		createdAt?: SortOrder;
	};

	export type EnumMessageRoleWithAggregatesFilter<$PrismaModel = never> = {
		equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>;
		in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>;
		notIn?:
			| $Enums.MessageRole[]
			| ListEnumMessageRoleFieldRefInput<$PrismaModel>;
		not?:
			| NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel>
			| $Enums.MessageRole;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumMessageRoleFilter<$PrismaModel>;
		_max?: NestedEnumMessageRoleFilter<$PrismaModel>;
	};
	export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
		| PatchUndefined<
				Either<
					Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
					Exclude<
						keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
						"path"
					>
				>,
				Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
		  >
		| OptionalFlat<
				Omit<
					Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
					"path"
				>
		  >;

	export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
		equals?:
			| InputJsonValue
			| JsonFieldRefInput<$PrismaModel>
			| JsonNullValueFilter;
		path?: string[];
		mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
		string_contains?: string | StringFieldRefInput<$PrismaModel>;
		string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
		string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
		array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
		array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
		array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
		lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
		lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
		gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
		gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
		not?:
			| InputJsonValue
			| JsonFieldRefInput<$PrismaModel>
			| JsonNullValueFilter;
		_count?: NestedIntNullableFilter<$PrismaModel>;
		_min?: NestedJsonNullableFilter<$PrismaModel>;
		_max?: NestedJsonNullableFilter<$PrismaModel>;
	};

	export type ProjectCreateNestedManyWithoutUserInput = {
		create?:
			| XOR<
					ProjectCreateWithoutUserInput,
					ProjectUncheckedCreateWithoutUserInput
			  >
			| ProjectCreateWithoutUserInput[]
			| ProjectUncheckedCreateWithoutUserInput[];
		connectOrCreate?:
			| ProjectCreateOrConnectWithoutUserInput
			| ProjectCreateOrConnectWithoutUserInput[];
		createMany?: ProjectCreateManyUserInputEnvelope;
		connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
	};

	export type ProjectUncheckedCreateNestedManyWithoutUserInput = {
		create?:
			| XOR<
					ProjectCreateWithoutUserInput,
					ProjectUncheckedCreateWithoutUserInput
			  >
			| ProjectCreateWithoutUserInput[]
			| ProjectUncheckedCreateWithoutUserInput[];
		connectOrCreate?:
			| ProjectCreateOrConnectWithoutUserInput
			| ProjectCreateOrConnectWithoutUserInput[];
		createMany?: ProjectCreateManyUserInputEnvelope;
		connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
	};

	export type StringFieldUpdateOperationsInput = {
		set?: string;
	};

	export type NullableStringFieldUpdateOperationsInput = {
		set?: string | null;
	};

	export type DateTimeFieldUpdateOperationsInput = {
		set?: Date | string;
	};

	export type ProjectUpdateManyWithoutUserNestedInput = {
		create?:
			| XOR<
					ProjectCreateWithoutUserInput,
					ProjectUncheckedCreateWithoutUserInput
			  >
			| ProjectCreateWithoutUserInput[]
			| ProjectUncheckedCreateWithoutUserInput[];
		connectOrCreate?:
			| ProjectCreateOrConnectWithoutUserInput
			| ProjectCreateOrConnectWithoutUserInput[];
		upsert?:
			| ProjectUpsertWithWhereUniqueWithoutUserInput
			| ProjectUpsertWithWhereUniqueWithoutUserInput[];
		createMany?: ProjectCreateManyUserInputEnvelope;
		set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
		disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
		delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
		connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
		update?:
			| ProjectUpdateWithWhereUniqueWithoutUserInput
			| ProjectUpdateWithWhereUniqueWithoutUserInput[];
		updateMany?:
			| ProjectUpdateManyWithWhereWithoutUserInput
			| ProjectUpdateManyWithWhereWithoutUserInput[];
		deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[];
	};

	export type ProjectUncheckedUpdateManyWithoutUserNestedInput = {
		create?:
			| XOR<
					ProjectCreateWithoutUserInput,
					ProjectUncheckedCreateWithoutUserInput
			  >
			| ProjectCreateWithoutUserInput[]
			| ProjectUncheckedCreateWithoutUserInput[];
		connectOrCreate?:
			| ProjectCreateOrConnectWithoutUserInput
			| ProjectCreateOrConnectWithoutUserInput[];
		upsert?:
			| ProjectUpsertWithWhereUniqueWithoutUserInput
			| ProjectUpsertWithWhereUniqueWithoutUserInput[];
		createMany?: ProjectCreateManyUserInputEnvelope;
		set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
		disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
		delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
		connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
		update?:
			| ProjectUpdateWithWhereUniqueWithoutUserInput
			| ProjectUpdateWithWhereUniqueWithoutUserInput[];
		updateMany?:
			| ProjectUpdateManyWithWhereWithoutUserInput
			| ProjectUpdateManyWithWhereWithoutUserInput[];
		deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[];
	};

	export type UserCreateNestedOneWithoutProjectsInput = {
		create?: XOR<
			UserCreateWithoutProjectsInput,
			UserUncheckedCreateWithoutProjectsInput
		>;
		connectOrCreate?: UserCreateOrConnectWithoutProjectsInput;
		connect?: UserWhereUniqueInput;
	};

	export type ProjectVersionCreateNestedManyWithoutProjectInput = {
		create?:
			| XOR<
					ProjectVersionCreateWithoutProjectInput,
					ProjectVersionUncheckedCreateWithoutProjectInput
			  >
			| ProjectVersionCreateWithoutProjectInput[]
			| ProjectVersionUncheckedCreateWithoutProjectInput[];
		connectOrCreate?:
			| ProjectVersionCreateOrConnectWithoutProjectInput
			| ProjectVersionCreateOrConnectWithoutProjectInput[];
		createMany?: ProjectVersionCreateManyProjectInputEnvelope;
		connect?: ProjectVersionWhereUniqueInput | ProjectVersionWhereUniqueInput[];
	};

	export type ProjectFileCreateNestedManyWithoutProjectInput = {
		create?:
			| XOR<
					ProjectFileCreateWithoutProjectInput,
					ProjectFileUncheckedCreateWithoutProjectInput
			  >
			| ProjectFileCreateWithoutProjectInput[]
			| ProjectFileUncheckedCreateWithoutProjectInput[];
		connectOrCreate?:
			| ProjectFileCreateOrConnectWithoutProjectInput
			| ProjectFileCreateOrConnectWithoutProjectInput[];
		createMany?: ProjectFileCreateManyProjectInputEnvelope;
		connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
	};

	export type ChatMessageCreateNestedManyWithoutProjectInput = {
		create?:
			| XOR<
					ChatMessageCreateWithoutProjectInput,
					ChatMessageUncheckedCreateWithoutProjectInput
			  >
			| ChatMessageCreateWithoutProjectInput[]
			| ChatMessageUncheckedCreateWithoutProjectInput[];
		connectOrCreate?:
			| ChatMessageCreateOrConnectWithoutProjectInput
			| ChatMessageCreateOrConnectWithoutProjectInput[];
		createMany?: ChatMessageCreateManyProjectInputEnvelope;
		connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
	};

	export type ProjectVersionUncheckedCreateNestedManyWithoutProjectInput = {
		create?:
			| XOR<
					ProjectVersionCreateWithoutProjectInput,
					ProjectVersionUncheckedCreateWithoutProjectInput
			  >
			| ProjectVersionCreateWithoutProjectInput[]
			| ProjectVersionUncheckedCreateWithoutProjectInput[];
		connectOrCreate?:
			| ProjectVersionCreateOrConnectWithoutProjectInput
			| ProjectVersionCreateOrConnectWithoutProjectInput[];
		createMany?: ProjectVersionCreateManyProjectInputEnvelope;
		connect?: ProjectVersionWhereUniqueInput | ProjectVersionWhereUniqueInput[];
	};

	export type ProjectFileUncheckedCreateNestedManyWithoutProjectInput = {
		create?:
			| XOR<
					ProjectFileCreateWithoutProjectInput,
					ProjectFileUncheckedCreateWithoutProjectInput
			  >
			| ProjectFileCreateWithoutProjectInput[]
			| ProjectFileUncheckedCreateWithoutProjectInput[];
		connectOrCreate?:
			| ProjectFileCreateOrConnectWithoutProjectInput
			| ProjectFileCreateOrConnectWithoutProjectInput[];
		createMany?: ProjectFileCreateManyProjectInputEnvelope;
		connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
	};

	export type ChatMessageUncheckedCreateNestedManyWithoutProjectInput = {
		create?:
			| XOR<
					ChatMessageCreateWithoutProjectInput,
					ChatMessageUncheckedCreateWithoutProjectInput
			  >
			| ChatMessageCreateWithoutProjectInput[]
			| ChatMessageUncheckedCreateWithoutProjectInput[];
		connectOrCreate?:
			| ChatMessageCreateOrConnectWithoutProjectInput
			| ChatMessageCreateOrConnectWithoutProjectInput[];
		createMany?: ChatMessageCreateManyProjectInputEnvelope;
		connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
	};

	export type EnumProjectStatusFieldUpdateOperationsInput = {
		set?: $Enums.ProjectStatus;
	};

	export type UserUpdateOneRequiredWithoutProjectsNestedInput = {
		create?: XOR<
			UserCreateWithoutProjectsInput,
			UserUncheckedCreateWithoutProjectsInput
		>;
		connectOrCreate?: UserCreateOrConnectWithoutProjectsInput;
		upsert?: UserUpsertWithoutProjectsInput;
		connect?: UserWhereUniqueInput;
		update?: XOR<
			XOR<
				UserUpdateToOneWithWhereWithoutProjectsInput,
				UserUpdateWithoutProjectsInput
			>,
			UserUncheckedUpdateWithoutProjectsInput
		>;
	};

	export type ProjectVersionUpdateManyWithoutProjectNestedInput = {
		create?:
			| XOR<
					ProjectVersionCreateWithoutProjectInput,
					ProjectVersionUncheckedCreateWithoutProjectInput
			  >
			| ProjectVersionCreateWithoutProjectInput[]
			| ProjectVersionUncheckedCreateWithoutProjectInput[];
		connectOrCreate?:
			| ProjectVersionCreateOrConnectWithoutProjectInput
			| ProjectVersionCreateOrConnectWithoutProjectInput[];
		upsert?:
			| ProjectVersionUpsertWithWhereUniqueWithoutProjectInput
			| ProjectVersionUpsertWithWhereUniqueWithoutProjectInput[];
		createMany?: ProjectVersionCreateManyProjectInputEnvelope;
		set?: ProjectVersionWhereUniqueInput | ProjectVersionWhereUniqueInput[];
		disconnect?:
			| ProjectVersionWhereUniqueInput
			| ProjectVersionWhereUniqueInput[];
		delete?: ProjectVersionWhereUniqueInput | ProjectVersionWhereUniqueInput[];
		connect?: ProjectVersionWhereUniqueInput | ProjectVersionWhereUniqueInput[];
		update?:
			| ProjectVersionUpdateWithWhereUniqueWithoutProjectInput
			| ProjectVersionUpdateWithWhereUniqueWithoutProjectInput[];
		updateMany?:
			| ProjectVersionUpdateManyWithWhereWithoutProjectInput
			| ProjectVersionUpdateManyWithWhereWithoutProjectInput[];
		deleteMany?:
			| ProjectVersionScalarWhereInput
			| ProjectVersionScalarWhereInput[];
	};

	export type ProjectFileUpdateManyWithoutProjectNestedInput = {
		create?:
			| XOR<
					ProjectFileCreateWithoutProjectInput,
					ProjectFileUncheckedCreateWithoutProjectInput
			  >
			| ProjectFileCreateWithoutProjectInput[]
			| ProjectFileUncheckedCreateWithoutProjectInput[];
		connectOrCreate?:
			| ProjectFileCreateOrConnectWithoutProjectInput
			| ProjectFileCreateOrConnectWithoutProjectInput[];
		upsert?:
			| ProjectFileUpsertWithWhereUniqueWithoutProjectInput
			| ProjectFileUpsertWithWhereUniqueWithoutProjectInput[];
		createMany?: ProjectFileCreateManyProjectInputEnvelope;
		set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
		disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
		delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
		connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
		update?:
			| ProjectFileUpdateWithWhereUniqueWithoutProjectInput
			| ProjectFileUpdateWithWhereUniqueWithoutProjectInput[];
		updateMany?:
			| ProjectFileUpdateManyWithWhereWithoutProjectInput
			| ProjectFileUpdateManyWithWhereWithoutProjectInput[];
		deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[];
	};

	export type ChatMessageUpdateManyWithoutProjectNestedInput = {
		create?:
			| XOR<
					ChatMessageCreateWithoutProjectInput,
					ChatMessageUncheckedCreateWithoutProjectInput
			  >
			| ChatMessageCreateWithoutProjectInput[]
			| ChatMessageUncheckedCreateWithoutProjectInput[];
		connectOrCreate?:
			| ChatMessageCreateOrConnectWithoutProjectInput
			| ChatMessageCreateOrConnectWithoutProjectInput[];
		upsert?:
			| ChatMessageUpsertWithWhereUniqueWithoutProjectInput
			| ChatMessageUpsertWithWhereUniqueWithoutProjectInput[];
		createMany?: ChatMessageCreateManyProjectInputEnvelope;
		set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
		disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
		delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
		connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
		update?:
			| ChatMessageUpdateWithWhereUniqueWithoutProjectInput
			| ChatMessageUpdateWithWhereUniqueWithoutProjectInput[];
		updateMany?:
			| ChatMessageUpdateManyWithWhereWithoutProjectInput
			| ChatMessageUpdateManyWithWhereWithoutProjectInput[];
		deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[];
	};

	export type ProjectVersionUncheckedUpdateManyWithoutProjectNestedInput = {
		create?:
			| XOR<
					ProjectVersionCreateWithoutProjectInput,
					ProjectVersionUncheckedCreateWithoutProjectInput
			  >
			| ProjectVersionCreateWithoutProjectInput[]
			| ProjectVersionUncheckedCreateWithoutProjectInput[];
		connectOrCreate?:
			| ProjectVersionCreateOrConnectWithoutProjectInput
			| ProjectVersionCreateOrConnectWithoutProjectInput[];
		upsert?:
			| ProjectVersionUpsertWithWhereUniqueWithoutProjectInput
			| ProjectVersionUpsertWithWhereUniqueWithoutProjectInput[];
		createMany?: ProjectVersionCreateManyProjectInputEnvelope;
		set?: ProjectVersionWhereUniqueInput | ProjectVersionWhereUniqueInput[];
		disconnect?:
			| ProjectVersionWhereUniqueInput
			| ProjectVersionWhereUniqueInput[];
		delete?: ProjectVersionWhereUniqueInput | ProjectVersionWhereUniqueInput[];
		connect?: ProjectVersionWhereUniqueInput | ProjectVersionWhereUniqueInput[];
		update?:
			| ProjectVersionUpdateWithWhereUniqueWithoutProjectInput
			| ProjectVersionUpdateWithWhereUniqueWithoutProjectInput[];
		updateMany?:
			| ProjectVersionUpdateManyWithWhereWithoutProjectInput
			| ProjectVersionUpdateManyWithWhereWithoutProjectInput[];
		deleteMany?:
			| ProjectVersionScalarWhereInput
			| ProjectVersionScalarWhereInput[];
	};

	export type ProjectFileUncheckedUpdateManyWithoutProjectNestedInput = {
		create?:
			| XOR<
					ProjectFileCreateWithoutProjectInput,
					ProjectFileUncheckedCreateWithoutProjectInput
			  >
			| ProjectFileCreateWithoutProjectInput[]
			| ProjectFileUncheckedCreateWithoutProjectInput[];
		connectOrCreate?:
			| ProjectFileCreateOrConnectWithoutProjectInput
			| ProjectFileCreateOrConnectWithoutProjectInput[];
		upsert?:
			| ProjectFileUpsertWithWhereUniqueWithoutProjectInput
			| ProjectFileUpsertWithWhereUniqueWithoutProjectInput[];
		createMany?: ProjectFileCreateManyProjectInputEnvelope;
		set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
		disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
		delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
		connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
		update?:
			| ProjectFileUpdateWithWhereUniqueWithoutProjectInput
			| ProjectFileUpdateWithWhereUniqueWithoutProjectInput[];
		updateMany?:
			| ProjectFileUpdateManyWithWhereWithoutProjectInput
			| ProjectFileUpdateManyWithWhereWithoutProjectInput[];
		deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[];
	};

	export type ChatMessageUncheckedUpdateManyWithoutProjectNestedInput = {
		create?:
			| XOR<
					ChatMessageCreateWithoutProjectInput,
					ChatMessageUncheckedCreateWithoutProjectInput
			  >
			| ChatMessageCreateWithoutProjectInput[]
			| ChatMessageUncheckedCreateWithoutProjectInput[];
		connectOrCreate?:
			| ChatMessageCreateOrConnectWithoutProjectInput
			| ChatMessageCreateOrConnectWithoutProjectInput[];
		upsert?:
			| ChatMessageUpsertWithWhereUniqueWithoutProjectInput
			| ChatMessageUpsertWithWhereUniqueWithoutProjectInput[];
		createMany?: ChatMessageCreateManyProjectInputEnvelope;
		set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
		disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
		delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
		connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
		update?:
			| ChatMessageUpdateWithWhereUniqueWithoutProjectInput
			| ChatMessageUpdateWithWhereUniqueWithoutProjectInput[];
		updateMany?:
			| ChatMessageUpdateManyWithWhereWithoutProjectInput
			| ChatMessageUpdateManyWithWhereWithoutProjectInput[];
		deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[];
	};

	export type ProjectCreateNestedOneWithoutVersionsInput = {
		create?: XOR<
			ProjectCreateWithoutVersionsInput,
			ProjectUncheckedCreateWithoutVersionsInput
		>;
		connectOrCreate?: ProjectCreateOrConnectWithoutVersionsInput;
		connect?: ProjectWhereUniqueInput;
	};

	export type ProjectFileCreateNestedManyWithoutVersionInput = {
		create?:
			| XOR<
					ProjectFileCreateWithoutVersionInput,
					ProjectFileUncheckedCreateWithoutVersionInput
			  >
			| ProjectFileCreateWithoutVersionInput[]
			| ProjectFileUncheckedCreateWithoutVersionInput[];
		connectOrCreate?:
			| ProjectFileCreateOrConnectWithoutVersionInput
			| ProjectFileCreateOrConnectWithoutVersionInput[];
		createMany?: ProjectFileCreateManyVersionInputEnvelope;
		connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
	};

	export type ChatMessageCreateNestedManyWithoutVersionInput = {
		create?:
			| XOR<
					ChatMessageCreateWithoutVersionInput,
					ChatMessageUncheckedCreateWithoutVersionInput
			  >
			| ChatMessageCreateWithoutVersionInput[]
			| ChatMessageUncheckedCreateWithoutVersionInput[];
		connectOrCreate?:
			| ChatMessageCreateOrConnectWithoutVersionInput
			| ChatMessageCreateOrConnectWithoutVersionInput[];
		createMany?: ChatMessageCreateManyVersionInputEnvelope;
		connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
	};

	export type ProjectFileUncheckedCreateNestedManyWithoutVersionInput = {
		create?:
			| XOR<
					ProjectFileCreateWithoutVersionInput,
					ProjectFileUncheckedCreateWithoutVersionInput
			  >
			| ProjectFileCreateWithoutVersionInput[]
			| ProjectFileUncheckedCreateWithoutVersionInput[];
		connectOrCreate?:
			| ProjectFileCreateOrConnectWithoutVersionInput
			| ProjectFileCreateOrConnectWithoutVersionInput[];
		createMany?: ProjectFileCreateManyVersionInputEnvelope;
		connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
	};

	export type ChatMessageUncheckedCreateNestedManyWithoutVersionInput = {
		create?:
			| XOR<
					ChatMessageCreateWithoutVersionInput,
					ChatMessageUncheckedCreateWithoutVersionInput
			  >
			| ChatMessageCreateWithoutVersionInput[]
			| ChatMessageUncheckedCreateWithoutVersionInput[];
		connectOrCreate?:
			| ChatMessageCreateOrConnectWithoutVersionInput
			| ChatMessageCreateOrConnectWithoutVersionInput[];
		createMany?: ChatMessageCreateManyVersionInputEnvelope;
		connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
	};

	export type IntFieldUpdateOperationsInput = {
		set?: number;
		increment?: number;
		decrement?: number;
		multiply?: number;
		divide?: number;
	};

	export type ProjectUpdateOneRequiredWithoutVersionsNestedInput = {
		create?: XOR<
			ProjectCreateWithoutVersionsInput,
			ProjectUncheckedCreateWithoutVersionsInput
		>;
		connectOrCreate?: ProjectCreateOrConnectWithoutVersionsInput;
		upsert?: ProjectUpsertWithoutVersionsInput;
		connect?: ProjectWhereUniqueInput;
		update?: XOR<
			XOR<
				ProjectUpdateToOneWithWhereWithoutVersionsInput,
				ProjectUpdateWithoutVersionsInput
			>,
			ProjectUncheckedUpdateWithoutVersionsInput
		>;
	};

	export type ProjectFileUpdateManyWithoutVersionNestedInput = {
		create?:
			| XOR<
					ProjectFileCreateWithoutVersionInput,
					ProjectFileUncheckedCreateWithoutVersionInput
			  >
			| ProjectFileCreateWithoutVersionInput[]
			| ProjectFileUncheckedCreateWithoutVersionInput[];
		connectOrCreate?:
			| ProjectFileCreateOrConnectWithoutVersionInput
			| ProjectFileCreateOrConnectWithoutVersionInput[];
		upsert?:
			| ProjectFileUpsertWithWhereUniqueWithoutVersionInput
			| ProjectFileUpsertWithWhereUniqueWithoutVersionInput[];
		createMany?: ProjectFileCreateManyVersionInputEnvelope;
		set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
		disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
		delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
		connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
		update?:
			| ProjectFileUpdateWithWhereUniqueWithoutVersionInput
			| ProjectFileUpdateWithWhereUniqueWithoutVersionInput[];
		updateMany?:
			| ProjectFileUpdateManyWithWhereWithoutVersionInput
			| ProjectFileUpdateManyWithWhereWithoutVersionInput[];
		deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[];
	};

	export type ChatMessageUpdateManyWithoutVersionNestedInput = {
		create?:
			| XOR<
					ChatMessageCreateWithoutVersionInput,
					ChatMessageUncheckedCreateWithoutVersionInput
			  >
			| ChatMessageCreateWithoutVersionInput[]
			| ChatMessageUncheckedCreateWithoutVersionInput[];
		connectOrCreate?:
			| ChatMessageCreateOrConnectWithoutVersionInput
			| ChatMessageCreateOrConnectWithoutVersionInput[];
		upsert?:
			| ChatMessageUpsertWithWhereUniqueWithoutVersionInput
			| ChatMessageUpsertWithWhereUniqueWithoutVersionInput[];
		createMany?: ChatMessageCreateManyVersionInputEnvelope;
		set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
		disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
		delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
		connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
		update?:
			| ChatMessageUpdateWithWhereUniqueWithoutVersionInput
			| ChatMessageUpdateWithWhereUniqueWithoutVersionInput[];
		updateMany?:
			| ChatMessageUpdateManyWithWhereWithoutVersionInput
			| ChatMessageUpdateManyWithWhereWithoutVersionInput[];
		deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[];
	};

	export type ProjectFileUncheckedUpdateManyWithoutVersionNestedInput = {
		create?:
			| XOR<
					ProjectFileCreateWithoutVersionInput,
					ProjectFileUncheckedCreateWithoutVersionInput
			  >
			| ProjectFileCreateWithoutVersionInput[]
			| ProjectFileUncheckedCreateWithoutVersionInput[];
		connectOrCreate?:
			| ProjectFileCreateOrConnectWithoutVersionInput
			| ProjectFileCreateOrConnectWithoutVersionInput[];
		upsert?:
			| ProjectFileUpsertWithWhereUniqueWithoutVersionInput
			| ProjectFileUpsertWithWhereUniqueWithoutVersionInput[];
		createMany?: ProjectFileCreateManyVersionInputEnvelope;
		set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
		disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
		delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
		connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[];
		update?:
			| ProjectFileUpdateWithWhereUniqueWithoutVersionInput
			| ProjectFileUpdateWithWhereUniqueWithoutVersionInput[];
		updateMany?:
			| ProjectFileUpdateManyWithWhereWithoutVersionInput
			| ProjectFileUpdateManyWithWhereWithoutVersionInput[];
		deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[];
	};

	export type ChatMessageUncheckedUpdateManyWithoutVersionNestedInput = {
		create?:
			| XOR<
					ChatMessageCreateWithoutVersionInput,
					ChatMessageUncheckedCreateWithoutVersionInput
			  >
			| ChatMessageCreateWithoutVersionInput[]
			| ChatMessageUncheckedCreateWithoutVersionInput[];
		connectOrCreate?:
			| ChatMessageCreateOrConnectWithoutVersionInput
			| ChatMessageCreateOrConnectWithoutVersionInput[];
		upsert?:
			| ChatMessageUpsertWithWhereUniqueWithoutVersionInput
			| ChatMessageUpsertWithWhereUniqueWithoutVersionInput[];
		createMany?: ChatMessageCreateManyVersionInputEnvelope;
		set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
		disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
		delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
		connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[];
		update?:
			| ChatMessageUpdateWithWhereUniqueWithoutVersionInput
			| ChatMessageUpdateWithWhereUniqueWithoutVersionInput[];
		updateMany?:
			| ChatMessageUpdateManyWithWhereWithoutVersionInput
			| ChatMessageUpdateManyWithWhereWithoutVersionInput[];
		deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[];
	};

	export type ProjectCreateNestedOneWithoutFilesInput = {
		create?: XOR<
			ProjectCreateWithoutFilesInput,
			ProjectUncheckedCreateWithoutFilesInput
		>;
		connectOrCreate?: ProjectCreateOrConnectWithoutFilesInput;
		connect?: ProjectWhereUniqueInput;
	};

	export type ProjectVersionCreateNestedOneWithoutFilesInput = {
		create?: XOR<
			ProjectVersionCreateWithoutFilesInput,
			ProjectVersionUncheckedCreateWithoutFilesInput
		>;
		connectOrCreate?: ProjectVersionCreateOrConnectWithoutFilesInput;
		connect?: ProjectVersionWhereUniqueInput;
	};

	export type EnumFileSourceFieldUpdateOperationsInput = {
		set?: $Enums.FileSource;
	};

	export type ProjectUpdateOneRequiredWithoutFilesNestedInput = {
		create?: XOR<
			ProjectCreateWithoutFilesInput,
			ProjectUncheckedCreateWithoutFilesInput
		>;
		connectOrCreate?: ProjectCreateOrConnectWithoutFilesInput;
		upsert?: ProjectUpsertWithoutFilesInput;
		connect?: ProjectWhereUniqueInput;
		update?: XOR<
			XOR<
				ProjectUpdateToOneWithWhereWithoutFilesInput,
				ProjectUpdateWithoutFilesInput
			>,
			ProjectUncheckedUpdateWithoutFilesInput
		>;
	};

	export type ProjectVersionUpdateOneRequiredWithoutFilesNestedInput = {
		create?: XOR<
			ProjectVersionCreateWithoutFilesInput,
			ProjectVersionUncheckedCreateWithoutFilesInput
		>;
		connectOrCreate?: ProjectVersionCreateOrConnectWithoutFilesInput;
		upsert?: ProjectVersionUpsertWithoutFilesInput;
		connect?: ProjectVersionWhereUniqueInput;
		update?: XOR<
			XOR<
				ProjectVersionUpdateToOneWithWhereWithoutFilesInput,
				ProjectVersionUpdateWithoutFilesInput
			>,
			ProjectVersionUncheckedUpdateWithoutFilesInput
		>;
	};

	export type ProjectCreateNestedOneWithoutChatMessagesInput = {
		create?: XOR<
			ProjectCreateWithoutChatMessagesInput,
			ProjectUncheckedCreateWithoutChatMessagesInput
		>;
		connectOrCreate?: ProjectCreateOrConnectWithoutChatMessagesInput;
		connect?: ProjectWhereUniqueInput;
	};

	export type ProjectVersionCreateNestedOneWithoutChatMessagesInput = {
		create?: XOR<
			ProjectVersionCreateWithoutChatMessagesInput,
			ProjectVersionUncheckedCreateWithoutChatMessagesInput
		>;
		connectOrCreate?: ProjectVersionCreateOrConnectWithoutChatMessagesInput;
		connect?: ProjectVersionWhereUniqueInput;
	};

	export type EnumMessageRoleFieldUpdateOperationsInput = {
		set?: $Enums.MessageRole;
	};

	export type ProjectUpdateOneRequiredWithoutChatMessagesNestedInput = {
		create?: XOR<
			ProjectCreateWithoutChatMessagesInput,
			ProjectUncheckedCreateWithoutChatMessagesInput
		>;
		connectOrCreate?: ProjectCreateOrConnectWithoutChatMessagesInput;
		upsert?: ProjectUpsertWithoutChatMessagesInput;
		connect?: ProjectWhereUniqueInput;
		update?: XOR<
			XOR<
				ProjectUpdateToOneWithWhereWithoutChatMessagesInput,
				ProjectUpdateWithoutChatMessagesInput
			>,
			ProjectUncheckedUpdateWithoutChatMessagesInput
		>;
	};

	export type ProjectVersionUpdateOneRequiredWithoutChatMessagesNestedInput = {
		create?: XOR<
			ProjectVersionCreateWithoutChatMessagesInput,
			ProjectVersionUncheckedCreateWithoutChatMessagesInput
		>;
		connectOrCreate?: ProjectVersionCreateOrConnectWithoutChatMessagesInput;
		upsert?: ProjectVersionUpsertWithoutChatMessagesInput;
		connect?: ProjectVersionWhereUniqueInput;
		update?: XOR<
			XOR<
				ProjectVersionUpdateToOneWithWhereWithoutChatMessagesInput,
				ProjectVersionUpdateWithoutChatMessagesInput
			>,
			ProjectVersionUncheckedUpdateWithoutChatMessagesInput
		>;
	};

	export type NestedStringFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel>;
		in?: string[] | ListStringFieldRefInput<$PrismaModel>;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		not?: NestedStringFilter<$PrismaModel> | string;
	};

	export type NestedStringNullableFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel> | null;
		in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		not?: NestedStringNullableFilter<$PrismaModel> | string | null;
	};

	export type NestedDateTimeFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
	};

	export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel>;
		in?: string[] | ListStringFieldRefInput<$PrismaModel>;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedStringFilter<$PrismaModel>;
		_max?: NestedStringFilter<$PrismaModel>;
	};

	export type NestedIntFilter<$PrismaModel = never> = {
		equals?: number | IntFieldRefInput<$PrismaModel>;
		in?: number[] | ListIntFieldRefInput<$PrismaModel>;
		notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
		lt?: number | IntFieldRefInput<$PrismaModel>;
		lte?: number | IntFieldRefInput<$PrismaModel>;
		gt?: number | IntFieldRefInput<$PrismaModel>;
		gte?: number | IntFieldRefInput<$PrismaModel>;
		not?: NestedIntFilter<$PrismaModel> | number;
	};

	export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel> | null;
		in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		not?:
			| NestedStringNullableWithAggregatesFilter<$PrismaModel>
			| string
			| null;
		_count?: NestedIntNullableFilter<$PrismaModel>;
		_min?: NestedStringNullableFilter<$PrismaModel>;
		_max?: NestedStringNullableFilter<$PrismaModel>;
	};

	export type NestedIntNullableFilter<$PrismaModel = never> = {
		equals?: number | IntFieldRefInput<$PrismaModel> | null;
		in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
		notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
		lt?: number | IntFieldRefInput<$PrismaModel>;
		lte?: number | IntFieldRefInput<$PrismaModel>;
		gt?: number | IntFieldRefInput<$PrismaModel>;
		gte?: number | IntFieldRefInput<$PrismaModel>;
		not?: NestedIntNullableFilter<$PrismaModel> | number | null;
	};

	export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedDateTimeFilter<$PrismaModel>;
		_max?: NestedDateTimeFilter<$PrismaModel>;
	};

	export type NestedEnumProjectStatusFilter<$PrismaModel = never> = {
		equals?:
			| $Enums.ProjectStatus
			| EnumProjectStatusFieldRefInput<$PrismaModel>;
		in?:
			| $Enums.ProjectStatus[]
			| ListEnumProjectStatusFieldRefInput<$PrismaModel>;
		notIn?:
			| $Enums.ProjectStatus[]
			| ListEnumProjectStatusFieldRefInput<$PrismaModel>;
		not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus;
	};

	export type NestedEnumProjectStatusWithAggregatesFilter<
		$PrismaModel = never,
	> = {
		equals?:
			| $Enums.ProjectStatus
			| EnumProjectStatusFieldRefInput<$PrismaModel>;
		in?:
			| $Enums.ProjectStatus[]
			| ListEnumProjectStatusFieldRefInput<$PrismaModel>;
		notIn?:
			| $Enums.ProjectStatus[]
			| ListEnumProjectStatusFieldRefInput<$PrismaModel>;
		not?:
			| NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel>
			| $Enums.ProjectStatus;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumProjectStatusFilter<$PrismaModel>;
		_max?: NestedEnumProjectStatusFilter<$PrismaModel>;
	};

	export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
		equals?: number | IntFieldRefInput<$PrismaModel>;
		in?: number[] | ListIntFieldRefInput<$PrismaModel>;
		notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
		lt?: number | IntFieldRefInput<$PrismaModel>;
		lte?: number | IntFieldRefInput<$PrismaModel>;
		gt?: number | IntFieldRefInput<$PrismaModel>;
		gte?: number | IntFieldRefInput<$PrismaModel>;
		not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
		_count?: NestedIntFilter<$PrismaModel>;
		_avg?: NestedFloatFilter<$PrismaModel>;
		_sum?: NestedIntFilter<$PrismaModel>;
		_min?: NestedIntFilter<$PrismaModel>;
		_max?: NestedIntFilter<$PrismaModel>;
	};

	export type NestedFloatFilter<$PrismaModel = never> = {
		equals?: number | FloatFieldRefInput<$PrismaModel>;
		in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		lt?: number | FloatFieldRefInput<$PrismaModel>;
		lte?: number | FloatFieldRefInput<$PrismaModel>;
		gt?: number | FloatFieldRefInput<$PrismaModel>;
		gte?: number | FloatFieldRefInput<$PrismaModel>;
		not?: NestedFloatFilter<$PrismaModel> | number;
	};

	export type NestedEnumFileSourceFilter<$PrismaModel = never> = {
		equals?: $Enums.FileSource | EnumFileSourceFieldRefInput<$PrismaModel>;
		in?: $Enums.FileSource[] | ListEnumFileSourceFieldRefInput<$PrismaModel>;
		notIn?: $Enums.FileSource[] | ListEnumFileSourceFieldRefInput<$PrismaModel>;
		not?: NestedEnumFileSourceFilter<$PrismaModel> | $Enums.FileSource;
	};

	export type NestedEnumFileSourceWithAggregatesFilter<$PrismaModel = never> = {
		equals?: $Enums.FileSource | EnumFileSourceFieldRefInput<$PrismaModel>;
		in?: $Enums.FileSource[] | ListEnumFileSourceFieldRefInput<$PrismaModel>;
		notIn?: $Enums.FileSource[] | ListEnumFileSourceFieldRefInput<$PrismaModel>;
		not?:
			| NestedEnumFileSourceWithAggregatesFilter<$PrismaModel>
			| $Enums.FileSource;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumFileSourceFilter<$PrismaModel>;
		_max?: NestedEnumFileSourceFilter<$PrismaModel>;
	};

	export type NestedEnumMessageRoleFilter<$PrismaModel = never> = {
		equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>;
		in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>;
		notIn?:
			| $Enums.MessageRole[]
			| ListEnumMessageRoleFieldRefInput<$PrismaModel>;
		not?: NestedEnumMessageRoleFilter<$PrismaModel> | $Enums.MessageRole;
	};

	export type NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel = never> =
		{
			equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>;
			in?:
				| $Enums.MessageRole[]
				| ListEnumMessageRoleFieldRefInput<$PrismaModel>;
			notIn?:
				| $Enums.MessageRole[]
				| ListEnumMessageRoleFieldRefInput<$PrismaModel>;
			not?:
				| NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel>
				| $Enums.MessageRole;
			_count?: NestedIntFilter<$PrismaModel>;
			_min?: NestedEnumMessageRoleFilter<$PrismaModel>;
			_max?: NestedEnumMessageRoleFilter<$PrismaModel>;
		};
	export type NestedJsonNullableFilter<$PrismaModel = never> =
		| PatchUndefined<
				Either<
					Required<NestedJsonNullableFilterBase<$PrismaModel>>,
					Exclude<
						keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>,
						"path"
					>
				>,
				Required<NestedJsonNullableFilterBase<$PrismaModel>>
		  >
		| OptionalFlat<
				Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, "path">
		  >;

	export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
		equals?:
			| InputJsonValue
			| JsonFieldRefInput<$PrismaModel>
			| JsonNullValueFilter;
		path?: string[];
		mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
		string_contains?: string | StringFieldRefInput<$PrismaModel>;
		string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
		string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
		array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
		array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
		array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
		lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
		lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
		gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
		gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
		not?:
			| InputJsonValue
			| JsonFieldRefInput<$PrismaModel>
			| JsonNullValueFilter;
	};

	export type ProjectCreateWithoutUserInput = {
		id?: string;
		name: string;
		description: string;
		status?: $Enums.ProjectStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		versions?: ProjectVersionCreateNestedManyWithoutProjectInput;
		files?: ProjectFileCreateNestedManyWithoutProjectInput;
		chatMessages?: ChatMessageCreateNestedManyWithoutProjectInput;
	};

	export type ProjectUncheckedCreateWithoutUserInput = {
		id?: string;
		name: string;
		description: string;
		status?: $Enums.ProjectStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		versions?: ProjectVersionUncheckedCreateNestedManyWithoutProjectInput;
		files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput;
		chatMessages?: ChatMessageUncheckedCreateNestedManyWithoutProjectInput;
	};

	export type ProjectCreateOrConnectWithoutUserInput = {
		where: ProjectWhereUniqueInput;
		create: XOR<
			ProjectCreateWithoutUserInput,
			ProjectUncheckedCreateWithoutUserInput
		>;
	};

	export type ProjectCreateManyUserInputEnvelope = {
		data: ProjectCreateManyUserInput | ProjectCreateManyUserInput[];
		skipDuplicates?: boolean;
	};

	export type ProjectUpsertWithWhereUniqueWithoutUserInput = {
		where: ProjectWhereUniqueInput;
		update: XOR<
			ProjectUpdateWithoutUserInput,
			ProjectUncheckedUpdateWithoutUserInput
		>;
		create: XOR<
			ProjectCreateWithoutUserInput,
			ProjectUncheckedCreateWithoutUserInput
		>;
	};

	export type ProjectUpdateWithWhereUniqueWithoutUserInput = {
		where: ProjectWhereUniqueInput;
		data: XOR<
			ProjectUpdateWithoutUserInput,
			ProjectUncheckedUpdateWithoutUserInput
		>;
	};

	export type ProjectUpdateManyWithWhereWithoutUserInput = {
		where: ProjectScalarWhereInput;
		data: XOR<
			ProjectUpdateManyMutationInput,
			ProjectUncheckedUpdateManyWithoutUserInput
		>;
	};

	export type ProjectScalarWhereInput = {
		AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[];
		OR?: ProjectScalarWhereInput[];
		NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[];
		id?: StringFilter<"Project"> | string;
		userId?: StringFilter<"Project"> | string;
		name?: StringFilter<"Project"> | string;
		description?: StringFilter<"Project"> | string;
		status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus;
		createdAt?: DateTimeFilter<"Project"> | Date | string;
		updatedAt?: DateTimeFilter<"Project"> | Date | string;
	};

	export type UserCreateWithoutProjectsInput = {
		id?: string;
		email: string;
		name?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type UserUncheckedCreateWithoutProjectsInput = {
		id?: string;
		email: string;
		name?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type UserCreateOrConnectWithoutProjectsInput = {
		where: UserWhereUniqueInput;
		create: XOR<
			UserCreateWithoutProjectsInput,
			UserUncheckedCreateWithoutProjectsInput
		>;
	};

	export type ProjectVersionCreateWithoutProjectInput = {
		id?: string;
		versionNumber: number;
		label?: string | null;
		createdAt?: Date | string;
		files?: ProjectFileCreateNestedManyWithoutVersionInput;
		chatMessages?: ChatMessageCreateNestedManyWithoutVersionInput;
	};

	export type ProjectVersionUncheckedCreateWithoutProjectInput = {
		id?: string;
		versionNumber: number;
		label?: string | null;
		createdAt?: Date | string;
		files?: ProjectFileUncheckedCreateNestedManyWithoutVersionInput;
		chatMessages?: ChatMessageUncheckedCreateNestedManyWithoutVersionInput;
	};

	export type ProjectVersionCreateOrConnectWithoutProjectInput = {
		where: ProjectVersionWhereUniqueInput;
		create: XOR<
			ProjectVersionCreateWithoutProjectInput,
			ProjectVersionUncheckedCreateWithoutProjectInput
		>;
	};

	export type ProjectVersionCreateManyProjectInputEnvelope = {
		data:
			| ProjectVersionCreateManyProjectInput
			| ProjectVersionCreateManyProjectInput[];
		skipDuplicates?: boolean;
	};

	export type ProjectFileCreateWithoutProjectInput = {
		id?: string;
		path: string;
		content: string;
		fileSource?: $Enums.FileSource;
		updatedAt?: Date | string;
		version: ProjectVersionCreateNestedOneWithoutFilesInput;
	};

	export type ProjectFileUncheckedCreateWithoutProjectInput = {
		id?: string;
		versionId: string;
		path: string;
		content: string;
		fileSource?: $Enums.FileSource;
		updatedAt?: Date | string;
	};

	export type ProjectFileCreateOrConnectWithoutProjectInput = {
		where: ProjectFileWhereUniqueInput;
		create: XOR<
			ProjectFileCreateWithoutProjectInput,
			ProjectFileUncheckedCreateWithoutProjectInput
		>;
	};

	export type ProjectFileCreateManyProjectInputEnvelope = {
		data:
			| ProjectFileCreateManyProjectInput
			| ProjectFileCreateManyProjectInput[];
		skipDuplicates?: boolean;
	};

	export type ChatMessageCreateWithoutProjectInput = {
		id?: string;
		role: $Enums.MessageRole;
		content: string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: Date | string;
		version: ProjectVersionCreateNestedOneWithoutChatMessagesInput;
	};

	export type ChatMessageUncheckedCreateWithoutProjectInput = {
		id?: string;
		versionId: string;
		role: $Enums.MessageRole;
		content: string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: Date | string;
	};

	export type ChatMessageCreateOrConnectWithoutProjectInput = {
		where: ChatMessageWhereUniqueInput;
		create: XOR<
			ChatMessageCreateWithoutProjectInput,
			ChatMessageUncheckedCreateWithoutProjectInput
		>;
	};

	export type ChatMessageCreateManyProjectInputEnvelope = {
		data:
			| ChatMessageCreateManyProjectInput
			| ChatMessageCreateManyProjectInput[];
		skipDuplicates?: boolean;
	};

	export type UserUpsertWithoutProjectsInput = {
		update: XOR<
			UserUpdateWithoutProjectsInput,
			UserUncheckedUpdateWithoutProjectsInput
		>;
		create: XOR<
			UserCreateWithoutProjectsInput,
			UserUncheckedCreateWithoutProjectsInput
		>;
		where?: UserWhereInput;
	};

	export type UserUpdateToOneWithWhereWithoutProjectsInput = {
		where?: UserWhereInput;
		data: XOR<
			UserUpdateWithoutProjectsInput,
			UserUncheckedUpdateWithoutProjectsInput
		>;
	};

	export type UserUpdateWithoutProjectsInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type UserUncheckedUpdateWithoutProjectsInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ProjectVersionUpsertWithWhereUniqueWithoutProjectInput = {
		where: ProjectVersionWhereUniqueInput;
		update: XOR<
			ProjectVersionUpdateWithoutProjectInput,
			ProjectVersionUncheckedUpdateWithoutProjectInput
		>;
		create: XOR<
			ProjectVersionCreateWithoutProjectInput,
			ProjectVersionUncheckedCreateWithoutProjectInput
		>;
	};

	export type ProjectVersionUpdateWithWhereUniqueWithoutProjectInput = {
		where: ProjectVersionWhereUniqueInput;
		data: XOR<
			ProjectVersionUpdateWithoutProjectInput,
			ProjectVersionUncheckedUpdateWithoutProjectInput
		>;
	};

	export type ProjectVersionUpdateManyWithWhereWithoutProjectInput = {
		where: ProjectVersionScalarWhereInput;
		data: XOR<
			ProjectVersionUpdateManyMutationInput,
			ProjectVersionUncheckedUpdateManyWithoutProjectInput
		>;
	};

	export type ProjectVersionScalarWhereInput = {
		AND?: ProjectVersionScalarWhereInput | ProjectVersionScalarWhereInput[];
		OR?: ProjectVersionScalarWhereInput[];
		NOT?: ProjectVersionScalarWhereInput | ProjectVersionScalarWhereInput[];
		id?: StringFilter<"ProjectVersion"> | string;
		projectId?: StringFilter<"ProjectVersion"> | string;
		versionNumber?: IntFilter<"ProjectVersion"> | number;
		label?: StringNullableFilter<"ProjectVersion"> | string | null;
		createdAt?: DateTimeFilter<"ProjectVersion"> | Date | string;
	};

	export type ProjectFileUpsertWithWhereUniqueWithoutProjectInput = {
		where: ProjectFileWhereUniqueInput;
		update: XOR<
			ProjectFileUpdateWithoutProjectInput,
			ProjectFileUncheckedUpdateWithoutProjectInput
		>;
		create: XOR<
			ProjectFileCreateWithoutProjectInput,
			ProjectFileUncheckedCreateWithoutProjectInput
		>;
	};

	export type ProjectFileUpdateWithWhereUniqueWithoutProjectInput = {
		where: ProjectFileWhereUniqueInput;
		data: XOR<
			ProjectFileUpdateWithoutProjectInput,
			ProjectFileUncheckedUpdateWithoutProjectInput
		>;
	};

	export type ProjectFileUpdateManyWithWhereWithoutProjectInput = {
		where: ProjectFileScalarWhereInput;
		data: XOR<
			ProjectFileUpdateManyMutationInput,
			ProjectFileUncheckedUpdateManyWithoutProjectInput
		>;
	};

	export type ProjectFileScalarWhereInput = {
		AND?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[];
		OR?: ProjectFileScalarWhereInput[];
		NOT?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[];
		id?: StringFilter<"ProjectFile"> | string;
		projectId?: StringFilter<"ProjectFile"> | string;
		versionId?: StringFilter<"ProjectFile"> | string;
		path?: StringFilter<"ProjectFile"> | string;
		content?: StringFilter<"ProjectFile"> | string;
		fileSource?: EnumFileSourceFilter<"ProjectFile"> | $Enums.FileSource;
		updatedAt?: DateTimeFilter<"ProjectFile"> | Date | string;
	};

	export type ChatMessageUpsertWithWhereUniqueWithoutProjectInput = {
		where: ChatMessageWhereUniqueInput;
		update: XOR<
			ChatMessageUpdateWithoutProjectInput,
			ChatMessageUncheckedUpdateWithoutProjectInput
		>;
		create: XOR<
			ChatMessageCreateWithoutProjectInput,
			ChatMessageUncheckedCreateWithoutProjectInput
		>;
	};

	export type ChatMessageUpdateWithWhereUniqueWithoutProjectInput = {
		where: ChatMessageWhereUniqueInput;
		data: XOR<
			ChatMessageUpdateWithoutProjectInput,
			ChatMessageUncheckedUpdateWithoutProjectInput
		>;
	};

	export type ChatMessageUpdateManyWithWhereWithoutProjectInput = {
		where: ChatMessageScalarWhereInput;
		data: XOR<
			ChatMessageUpdateManyMutationInput,
			ChatMessageUncheckedUpdateManyWithoutProjectInput
		>;
	};

	export type ChatMessageScalarWhereInput = {
		AND?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[];
		OR?: ChatMessageScalarWhereInput[];
		NOT?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[];
		id?: StringFilter<"ChatMessage"> | string;
		projectId?: StringFilter<"ChatMessage"> | string;
		versionId?: StringFilter<"ChatMessage"> | string;
		role?: EnumMessageRoleFilter<"ChatMessage"> | $Enums.MessageRole;
		content?: StringFilter<"ChatMessage"> | string;
		fileChanges?: JsonNullableFilter<"ChatMessage">;
		createdAt?: DateTimeFilter<"ChatMessage"> | Date | string;
	};

	export type ProjectCreateWithoutVersionsInput = {
		id?: string;
		name: string;
		description: string;
		status?: $Enums.ProjectStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		user: UserCreateNestedOneWithoutProjectsInput;
		files?: ProjectFileCreateNestedManyWithoutProjectInput;
		chatMessages?: ChatMessageCreateNestedManyWithoutProjectInput;
	};

	export type ProjectUncheckedCreateWithoutVersionsInput = {
		id?: string;
		userId: string;
		name: string;
		description: string;
		status?: $Enums.ProjectStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput;
		chatMessages?: ChatMessageUncheckedCreateNestedManyWithoutProjectInput;
	};

	export type ProjectCreateOrConnectWithoutVersionsInput = {
		where: ProjectWhereUniqueInput;
		create: XOR<
			ProjectCreateWithoutVersionsInput,
			ProjectUncheckedCreateWithoutVersionsInput
		>;
	};

	export type ProjectFileCreateWithoutVersionInput = {
		id?: string;
		path: string;
		content: string;
		fileSource?: $Enums.FileSource;
		updatedAt?: Date | string;
		project: ProjectCreateNestedOneWithoutFilesInput;
	};

	export type ProjectFileUncheckedCreateWithoutVersionInput = {
		id?: string;
		projectId: string;
		path: string;
		content: string;
		fileSource?: $Enums.FileSource;
		updatedAt?: Date | string;
	};

	export type ProjectFileCreateOrConnectWithoutVersionInput = {
		where: ProjectFileWhereUniqueInput;
		create: XOR<
			ProjectFileCreateWithoutVersionInput,
			ProjectFileUncheckedCreateWithoutVersionInput
		>;
	};

	export type ProjectFileCreateManyVersionInputEnvelope = {
		data:
			| ProjectFileCreateManyVersionInput
			| ProjectFileCreateManyVersionInput[];
		skipDuplicates?: boolean;
	};

	export type ChatMessageCreateWithoutVersionInput = {
		id?: string;
		role: $Enums.MessageRole;
		content: string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: Date | string;
		project: ProjectCreateNestedOneWithoutChatMessagesInput;
	};

	export type ChatMessageUncheckedCreateWithoutVersionInput = {
		id?: string;
		projectId: string;
		role: $Enums.MessageRole;
		content: string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: Date | string;
	};

	export type ChatMessageCreateOrConnectWithoutVersionInput = {
		where: ChatMessageWhereUniqueInput;
		create: XOR<
			ChatMessageCreateWithoutVersionInput,
			ChatMessageUncheckedCreateWithoutVersionInput
		>;
	};

	export type ChatMessageCreateManyVersionInputEnvelope = {
		data:
			| ChatMessageCreateManyVersionInput
			| ChatMessageCreateManyVersionInput[];
		skipDuplicates?: boolean;
	};

	export type ProjectUpsertWithoutVersionsInput = {
		update: XOR<
			ProjectUpdateWithoutVersionsInput,
			ProjectUncheckedUpdateWithoutVersionsInput
		>;
		create: XOR<
			ProjectCreateWithoutVersionsInput,
			ProjectUncheckedCreateWithoutVersionsInput
		>;
		where?: ProjectWhereInput;
	};

	export type ProjectUpdateToOneWithWhereWithoutVersionsInput = {
		where?: ProjectWhereInput;
		data: XOR<
			ProjectUpdateWithoutVersionsInput,
			ProjectUncheckedUpdateWithoutVersionsInput
		>;
	};

	export type ProjectUpdateWithoutVersionsInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		user?: UserUpdateOneRequiredWithoutProjectsNestedInput;
		files?: ProjectFileUpdateManyWithoutProjectNestedInput;
		chatMessages?: ChatMessageUpdateManyWithoutProjectNestedInput;
	};

	export type ProjectUncheckedUpdateWithoutVersionsInput = {
		id?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput;
		chatMessages?: ChatMessageUncheckedUpdateManyWithoutProjectNestedInput;
	};

	export type ProjectFileUpsertWithWhereUniqueWithoutVersionInput = {
		where: ProjectFileWhereUniqueInput;
		update: XOR<
			ProjectFileUpdateWithoutVersionInput,
			ProjectFileUncheckedUpdateWithoutVersionInput
		>;
		create: XOR<
			ProjectFileCreateWithoutVersionInput,
			ProjectFileUncheckedCreateWithoutVersionInput
		>;
	};

	export type ProjectFileUpdateWithWhereUniqueWithoutVersionInput = {
		where: ProjectFileWhereUniqueInput;
		data: XOR<
			ProjectFileUpdateWithoutVersionInput,
			ProjectFileUncheckedUpdateWithoutVersionInput
		>;
	};

	export type ProjectFileUpdateManyWithWhereWithoutVersionInput = {
		where: ProjectFileScalarWhereInput;
		data: XOR<
			ProjectFileUpdateManyMutationInput,
			ProjectFileUncheckedUpdateManyWithoutVersionInput
		>;
	};

	export type ChatMessageUpsertWithWhereUniqueWithoutVersionInput = {
		where: ChatMessageWhereUniqueInput;
		update: XOR<
			ChatMessageUpdateWithoutVersionInput,
			ChatMessageUncheckedUpdateWithoutVersionInput
		>;
		create: XOR<
			ChatMessageCreateWithoutVersionInput,
			ChatMessageUncheckedCreateWithoutVersionInput
		>;
	};

	export type ChatMessageUpdateWithWhereUniqueWithoutVersionInput = {
		where: ChatMessageWhereUniqueInput;
		data: XOR<
			ChatMessageUpdateWithoutVersionInput,
			ChatMessageUncheckedUpdateWithoutVersionInput
		>;
	};

	export type ChatMessageUpdateManyWithWhereWithoutVersionInput = {
		where: ChatMessageScalarWhereInput;
		data: XOR<
			ChatMessageUpdateManyMutationInput,
			ChatMessageUncheckedUpdateManyWithoutVersionInput
		>;
	};

	export type ProjectCreateWithoutFilesInput = {
		id?: string;
		name: string;
		description: string;
		status?: $Enums.ProjectStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		user: UserCreateNestedOneWithoutProjectsInput;
		versions?: ProjectVersionCreateNestedManyWithoutProjectInput;
		chatMessages?: ChatMessageCreateNestedManyWithoutProjectInput;
	};

	export type ProjectUncheckedCreateWithoutFilesInput = {
		id?: string;
		userId: string;
		name: string;
		description: string;
		status?: $Enums.ProjectStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		versions?: ProjectVersionUncheckedCreateNestedManyWithoutProjectInput;
		chatMessages?: ChatMessageUncheckedCreateNestedManyWithoutProjectInput;
	};

	export type ProjectCreateOrConnectWithoutFilesInput = {
		where: ProjectWhereUniqueInput;
		create: XOR<
			ProjectCreateWithoutFilesInput,
			ProjectUncheckedCreateWithoutFilesInput
		>;
	};

	export type ProjectVersionCreateWithoutFilesInput = {
		id?: string;
		versionNumber: number;
		label?: string | null;
		createdAt?: Date | string;
		project: ProjectCreateNestedOneWithoutVersionsInput;
		chatMessages?: ChatMessageCreateNestedManyWithoutVersionInput;
	};

	export type ProjectVersionUncheckedCreateWithoutFilesInput = {
		id?: string;
		projectId: string;
		versionNumber: number;
		label?: string | null;
		createdAt?: Date | string;
		chatMessages?: ChatMessageUncheckedCreateNestedManyWithoutVersionInput;
	};

	export type ProjectVersionCreateOrConnectWithoutFilesInput = {
		where: ProjectVersionWhereUniqueInput;
		create: XOR<
			ProjectVersionCreateWithoutFilesInput,
			ProjectVersionUncheckedCreateWithoutFilesInput
		>;
	};

	export type ProjectUpsertWithoutFilesInput = {
		update: XOR<
			ProjectUpdateWithoutFilesInput,
			ProjectUncheckedUpdateWithoutFilesInput
		>;
		create: XOR<
			ProjectCreateWithoutFilesInput,
			ProjectUncheckedCreateWithoutFilesInput
		>;
		where?: ProjectWhereInput;
	};

	export type ProjectUpdateToOneWithWhereWithoutFilesInput = {
		where?: ProjectWhereInput;
		data: XOR<
			ProjectUpdateWithoutFilesInput,
			ProjectUncheckedUpdateWithoutFilesInput
		>;
	};

	export type ProjectUpdateWithoutFilesInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		user?: UserUpdateOneRequiredWithoutProjectsNestedInput;
		versions?: ProjectVersionUpdateManyWithoutProjectNestedInput;
		chatMessages?: ChatMessageUpdateManyWithoutProjectNestedInput;
	};

	export type ProjectUncheckedUpdateWithoutFilesInput = {
		id?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		versions?: ProjectVersionUncheckedUpdateManyWithoutProjectNestedInput;
		chatMessages?: ChatMessageUncheckedUpdateManyWithoutProjectNestedInput;
	};

	export type ProjectVersionUpsertWithoutFilesInput = {
		update: XOR<
			ProjectVersionUpdateWithoutFilesInput,
			ProjectVersionUncheckedUpdateWithoutFilesInput
		>;
		create: XOR<
			ProjectVersionCreateWithoutFilesInput,
			ProjectVersionUncheckedCreateWithoutFilesInput
		>;
		where?: ProjectVersionWhereInput;
	};

	export type ProjectVersionUpdateToOneWithWhereWithoutFilesInput = {
		where?: ProjectVersionWhereInput;
		data: XOR<
			ProjectVersionUpdateWithoutFilesInput,
			ProjectVersionUncheckedUpdateWithoutFilesInput
		>;
	};

	export type ProjectVersionUpdateWithoutFilesInput = {
		id?: StringFieldUpdateOperationsInput | string;
		versionNumber?: IntFieldUpdateOperationsInput | number;
		label?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		project?: ProjectUpdateOneRequiredWithoutVersionsNestedInput;
		chatMessages?: ChatMessageUpdateManyWithoutVersionNestedInput;
	};

	export type ProjectVersionUncheckedUpdateWithoutFilesInput = {
		id?: StringFieldUpdateOperationsInput | string;
		projectId?: StringFieldUpdateOperationsInput | string;
		versionNumber?: IntFieldUpdateOperationsInput | number;
		label?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		chatMessages?: ChatMessageUncheckedUpdateManyWithoutVersionNestedInput;
	};

	export type ProjectCreateWithoutChatMessagesInput = {
		id?: string;
		name: string;
		description: string;
		status?: $Enums.ProjectStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		user: UserCreateNestedOneWithoutProjectsInput;
		versions?: ProjectVersionCreateNestedManyWithoutProjectInput;
		files?: ProjectFileCreateNestedManyWithoutProjectInput;
	};

	export type ProjectUncheckedCreateWithoutChatMessagesInput = {
		id?: string;
		userId: string;
		name: string;
		description: string;
		status?: $Enums.ProjectStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		versions?: ProjectVersionUncheckedCreateNestedManyWithoutProjectInput;
		files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput;
	};

	export type ProjectCreateOrConnectWithoutChatMessagesInput = {
		where: ProjectWhereUniqueInput;
		create: XOR<
			ProjectCreateWithoutChatMessagesInput,
			ProjectUncheckedCreateWithoutChatMessagesInput
		>;
	};

	export type ProjectVersionCreateWithoutChatMessagesInput = {
		id?: string;
		versionNumber: number;
		label?: string | null;
		createdAt?: Date | string;
		project: ProjectCreateNestedOneWithoutVersionsInput;
		files?: ProjectFileCreateNestedManyWithoutVersionInput;
	};

	export type ProjectVersionUncheckedCreateWithoutChatMessagesInput = {
		id?: string;
		projectId: string;
		versionNumber: number;
		label?: string | null;
		createdAt?: Date | string;
		files?: ProjectFileUncheckedCreateNestedManyWithoutVersionInput;
	};

	export type ProjectVersionCreateOrConnectWithoutChatMessagesInput = {
		where: ProjectVersionWhereUniqueInput;
		create: XOR<
			ProjectVersionCreateWithoutChatMessagesInput,
			ProjectVersionUncheckedCreateWithoutChatMessagesInput
		>;
	};

	export type ProjectUpsertWithoutChatMessagesInput = {
		update: XOR<
			ProjectUpdateWithoutChatMessagesInput,
			ProjectUncheckedUpdateWithoutChatMessagesInput
		>;
		create: XOR<
			ProjectCreateWithoutChatMessagesInput,
			ProjectUncheckedCreateWithoutChatMessagesInput
		>;
		where?: ProjectWhereInput;
	};

	export type ProjectUpdateToOneWithWhereWithoutChatMessagesInput = {
		where?: ProjectWhereInput;
		data: XOR<
			ProjectUpdateWithoutChatMessagesInput,
			ProjectUncheckedUpdateWithoutChatMessagesInput
		>;
	};

	export type ProjectUpdateWithoutChatMessagesInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		user?: UserUpdateOneRequiredWithoutProjectsNestedInput;
		versions?: ProjectVersionUpdateManyWithoutProjectNestedInput;
		files?: ProjectFileUpdateManyWithoutProjectNestedInput;
	};

	export type ProjectUncheckedUpdateWithoutChatMessagesInput = {
		id?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		versions?: ProjectVersionUncheckedUpdateManyWithoutProjectNestedInput;
		files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput;
	};

	export type ProjectVersionUpsertWithoutChatMessagesInput = {
		update: XOR<
			ProjectVersionUpdateWithoutChatMessagesInput,
			ProjectVersionUncheckedUpdateWithoutChatMessagesInput
		>;
		create: XOR<
			ProjectVersionCreateWithoutChatMessagesInput,
			ProjectVersionUncheckedCreateWithoutChatMessagesInput
		>;
		where?: ProjectVersionWhereInput;
	};

	export type ProjectVersionUpdateToOneWithWhereWithoutChatMessagesInput = {
		where?: ProjectVersionWhereInput;
		data: XOR<
			ProjectVersionUpdateWithoutChatMessagesInput,
			ProjectVersionUncheckedUpdateWithoutChatMessagesInput
		>;
	};

	export type ProjectVersionUpdateWithoutChatMessagesInput = {
		id?: StringFieldUpdateOperationsInput | string;
		versionNumber?: IntFieldUpdateOperationsInput | number;
		label?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		project?: ProjectUpdateOneRequiredWithoutVersionsNestedInput;
		files?: ProjectFileUpdateManyWithoutVersionNestedInput;
	};

	export type ProjectVersionUncheckedUpdateWithoutChatMessagesInput = {
		id?: StringFieldUpdateOperationsInput | string;
		projectId?: StringFieldUpdateOperationsInput | string;
		versionNumber?: IntFieldUpdateOperationsInput | number;
		label?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		files?: ProjectFileUncheckedUpdateManyWithoutVersionNestedInput;
	};

	export type ProjectCreateManyUserInput = {
		id?: string;
		name: string;
		description: string;
		status?: $Enums.ProjectStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type ProjectUpdateWithoutUserInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		versions?: ProjectVersionUpdateManyWithoutProjectNestedInput;
		files?: ProjectFileUpdateManyWithoutProjectNestedInput;
		chatMessages?: ChatMessageUpdateManyWithoutProjectNestedInput;
	};

	export type ProjectUncheckedUpdateWithoutUserInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		versions?: ProjectVersionUncheckedUpdateManyWithoutProjectNestedInput;
		files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput;
		chatMessages?: ChatMessageUncheckedUpdateManyWithoutProjectNestedInput;
	};

	export type ProjectUncheckedUpdateManyWithoutUserInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: StringFieldUpdateOperationsInput | string;
		status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ProjectVersionCreateManyProjectInput = {
		id?: string;
		versionNumber: number;
		label?: string | null;
		createdAt?: Date | string;
	};

	export type ProjectFileCreateManyProjectInput = {
		id?: string;
		versionId: string;
		path: string;
		content: string;
		fileSource?: $Enums.FileSource;
		updatedAt?: Date | string;
	};

	export type ChatMessageCreateManyProjectInput = {
		id?: string;
		versionId: string;
		role: $Enums.MessageRole;
		content: string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: Date | string;
	};

	export type ProjectVersionUpdateWithoutProjectInput = {
		id?: StringFieldUpdateOperationsInput | string;
		versionNumber?: IntFieldUpdateOperationsInput | number;
		label?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		files?: ProjectFileUpdateManyWithoutVersionNestedInput;
		chatMessages?: ChatMessageUpdateManyWithoutVersionNestedInput;
	};

	export type ProjectVersionUncheckedUpdateWithoutProjectInput = {
		id?: StringFieldUpdateOperationsInput | string;
		versionNumber?: IntFieldUpdateOperationsInput | number;
		label?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		files?: ProjectFileUncheckedUpdateManyWithoutVersionNestedInput;
		chatMessages?: ChatMessageUncheckedUpdateManyWithoutVersionNestedInput;
	};

	export type ProjectVersionUncheckedUpdateManyWithoutProjectInput = {
		id?: StringFieldUpdateOperationsInput | string;
		versionNumber?: IntFieldUpdateOperationsInput | number;
		label?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ProjectFileUpdateWithoutProjectInput = {
		id?: StringFieldUpdateOperationsInput | string;
		path?: StringFieldUpdateOperationsInput | string;
		content?: StringFieldUpdateOperationsInput | string;
		fileSource?: EnumFileSourceFieldUpdateOperationsInput | $Enums.FileSource;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		version?: ProjectVersionUpdateOneRequiredWithoutFilesNestedInput;
	};

	export type ProjectFileUncheckedUpdateWithoutProjectInput = {
		id?: StringFieldUpdateOperationsInput | string;
		versionId?: StringFieldUpdateOperationsInput | string;
		path?: StringFieldUpdateOperationsInput | string;
		content?: StringFieldUpdateOperationsInput | string;
		fileSource?: EnumFileSourceFieldUpdateOperationsInput | $Enums.FileSource;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ProjectFileUncheckedUpdateManyWithoutProjectInput = {
		id?: StringFieldUpdateOperationsInput | string;
		versionId?: StringFieldUpdateOperationsInput | string;
		path?: StringFieldUpdateOperationsInput | string;
		content?: StringFieldUpdateOperationsInput | string;
		fileSource?: EnumFileSourceFieldUpdateOperationsInput | $Enums.FileSource;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ChatMessageUpdateWithoutProjectInput = {
		id?: StringFieldUpdateOperationsInput | string;
		role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole;
		content?: StringFieldUpdateOperationsInput | string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		version?: ProjectVersionUpdateOneRequiredWithoutChatMessagesNestedInput;
	};

	export type ChatMessageUncheckedUpdateWithoutProjectInput = {
		id?: StringFieldUpdateOperationsInput | string;
		versionId?: StringFieldUpdateOperationsInput | string;
		role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole;
		content?: StringFieldUpdateOperationsInput | string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ChatMessageUncheckedUpdateManyWithoutProjectInput = {
		id?: StringFieldUpdateOperationsInput | string;
		versionId?: StringFieldUpdateOperationsInput | string;
		role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole;
		content?: StringFieldUpdateOperationsInput | string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ProjectFileCreateManyVersionInput = {
		id?: string;
		projectId: string;
		path: string;
		content: string;
		fileSource?: $Enums.FileSource;
		updatedAt?: Date | string;
	};

	export type ChatMessageCreateManyVersionInput = {
		id?: string;
		projectId: string;
		role: $Enums.MessageRole;
		content: string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: Date | string;
	};

	export type ProjectFileUpdateWithoutVersionInput = {
		id?: StringFieldUpdateOperationsInput | string;
		path?: StringFieldUpdateOperationsInput | string;
		content?: StringFieldUpdateOperationsInput | string;
		fileSource?: EnumFileSourceFieldUpdateOperationsInput | $Enums.FileSource;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		project?: ProjectUpdateOneRequiredWithoutFilesNestedInput;
	};

	export type ProjectFileUncheckedUpdateWithoutVersionInput = {
		id?: StringFieldUpdateOperationsInput | string;
		projectId?: StringFieldUpdateOperationsInput | string;
		path?: StringFieldUpdateOperationsInput | string;
		content?: StringFieldUpdateOperationsInput | string;
		fileSource?: EnumFileSourceFieldUpdateOperationsInput | $Enums.FileSource;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ProjectFileUncheckedUpdateManyWithoutVersionInput = {
		id?: StringFieldUpdateOperationsInput | string;
		projectId?: StringFieldUpdateOperationsInput | string;
		path?: StringFieldUpdateOperationsInput | string;
		content?: StringFieldUpdateOperationsInput | string;
		fileSource?: EnumFileSourceFieldUpdateOperationsInput | $Enums.FileSource;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ChatMessageUpdateWithoutVersionInput = {
		id?: StringFieldUpdateOperationsInput | string;
		role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole;
		content?: StringFieldUpdateOperationsInput | string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		project?: ProjectUpdateOneRequiredWithoutChatMessagesNestedInput;
	};

	export type ChatMessageUncheckedUpdateWithoutVersionInput = {
		id?: StringFieldUpdateOperationsInput | string;
		projectId?: StringFieldUpdateOperationsInput | string;
		role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole;
		content?: StringFieldUpdateOperationsInput | string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ChatMessageUncheckedUpdateManyWithoutVersionInput = {
		id?: StringFieldUpdateOperationsInput | string;
		projectId?: StringFieldUpdateOperationsInput | string;
		role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole;
		content?: StringFieldUpdateOperationsInput | string;
		fileChanges?: NullableJsonNullValueInput | InputJsonValue;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	/**
	 * Batch Payload for updateMany & deleteMany & createMany
	 */

	export type BatchPayload = {
		count: number;
	};

	/**
	 * DMMF
	 */
	export const dmmf: runtime.BaseDMMF;
}
