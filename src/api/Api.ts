/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum DsStatus {
  StatusDraft = "draft",
  StatusPublished = "published",
  StatusDeleted = "deleted",
}

export interface SerializerDraftSerializer {
  /** дата создания (вставки) */
  created_at?: string;
  creator?: SerializerUserSerializer;
  date_end?: string;
  date_start?: string;
  description?: string;
  /** NULL у черновика */
  formed_at?: string;
  id?: number;
  /** имя файла в MinIO */
  image?: string;
  image_url?: string;
  status?: DsStatus;
  title?: string;
  /** имя файла в MinIO */
  video?: string;
  video_url?: string;
}

export interface SerializerFeedSerializer {
  creator?: SerializerUserSerializer;
  date_end?: string;
  date_start?: string;
  description?: string;
  id?: number;
  image_url?: string;
  /** 1 — текущий пользователь лайкнул услугу */
  is_liked?: number;
  likes?: number;
  /** ид следующей услуги */
  next_id?: number;
  period?: string;
  /** номер услуги в ленте */
  position?: number;
  title?: string;
  /** всего услуг в ленте */
  total?: number;
  video_url?: string;
}

export interface SerializerImportCategorySerializer {
  date_end?: string;
  date_start?: string;
  id?: number;
  image_url?: string;
  /** 1 — создатель услуги = текущий пользователь */
  is_creator?: number;
  likes?: number;
  period?: string;
  title?: string;
}

export interface SerializerLikeRequest {
  like: 0 | 1;
}

export interface SerializerLikeSerializer {
  import_category_id?: number;
  is_liked?: number;
  likes?: number;
}

export interface SerializerLoginResponse {
  access_token?: string;
  /** срок действия, секунды */
  expires_in?: number;
  /** всегда Bearer */
  token_type?: string;
  user?: SerializerUserSerializer;
}

export interface SerializerPublishRequest {
  date_end: string;
  date_start: string;
  description?: string;
}

export interface SerializerResponse {
  data?: any;
  message?: string;
  status?: string;
}

export interface SerializerUserRequest {
  /**
   * @minLength 3
   * @maxLength 64
   */
  login: string;
  /**
   * @minLength 6
   * @maxLength 128
   */
  password: string;
}

export interface SerializerUserSerializer {
  id?: number;
  is_moderator?: boolean;
  login?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8080",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Амфора API
 * @version 1.0
 * @baseUrl http://localhost:8080
 * @contact Солижонов Умид, ИУ5
 *
 * Оценка торговых связей по статистике импортных находок: категории импорта (услуги), черновик, публикация, лента и лайки.
 * Гостю доступно только чтение (список и лента). Методы создателя требуют JWT: выполните POST /api/users/login, нажмите Authorize и вставьте access_token.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  importCategories = {
    /**
     * @description Опубликованные категории импорта с фильтром по дате начала. Доступен гостю; с токеном is_creator = 1 у услуг текущего пользователя.
     *
     * @tags import_categories
     * @name GetImportCategories
     * @summary Список услуг
     * @request GET:/api/import_categories
     */
    getImportCategories: (
      query?: {
        /**
         * Дата начала, ГГГГ-ММ-ДД (год до н. э.)
         * @example "0500-01-01"
         */
        date_start?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        SerializerResponse & {
          data?: SerializerImportCategorySerializer[];
        },
        SerializerResponse
      >({
        path: `/api/import_categories`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт черновик: название, фото и видео (файлами). Создатель — пользователь из токена. Нужна авторизация.
     *
     * @tags import_categories
     * @name CreateImportCategory
     * @summary Добавление услуги (шаг «Далее»)
     * @request POST:/api/import_categories
     * @secure
     */
    createImportCategory: (
      data: {
        /** Название */
        title: string;
        /**
         * Фото: JPG, PNG, WEBP до 10 МБ
         * @format binary
         */
        image?: File;
        /**
         * Видео: MP4, WEBM до 50 МБ
         * @format binary
         */
        video?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        SerializerResponse & {
          data?: SerializerDraftSerializer;
        },
        SerializerResponse
      >({
        path: `/api/import_categories`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Черновик текущего пользователя (не больше одного). Нужна авторизация.
     *
     * @tags import_categories
     * @name GetDraft
     * @summary Черновик
     * @request GET:/api/import_categories/draft
     * @secure
     */
    getDraft: (params: RequestParams = {}) =>
      this.request<
        SerializerResponse & {
          data?: SerializerDraftSerializer;
        },
        SerializerResponse
      >({
        path: `/api/import_categories/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Одна опубликованная услуга ленты. Без id — первая, с id — эта услуга, с id и next=true — следующая. Доступна гостю; с токеном заполняется is_liked.
     *
     * @tags import_categories
     * @name GetFeed
     * @summary Лента
     * @request GET:/api/import_categories/feed
     */
    getFeed: (
      query?: {
        /** Ид услуги */
        id?: number;
        /** true — следующая после id */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        SerializerResponse & {
          data?: SerializerFeedSerializer;
        },
        SerializerResponse
      >({
        path: `/api/import_categories/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Мягкое удаление (status = deleted). Только свои услуги. Нужна авторизация.
     *
     * @tags import_categories
     * @name DeleteImportCategory
     * @summary Удаление услуги
     * @request DELETE:/api/import_categories/{id}
     * @secure
     */
    deleteImportCategory: (id: number, params: RequestParams = {}) =>
      this.request<SerializerResponse, SerializerResponse>({
        path: `/api/import_categories/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description like = 1 ставит лайк от текущего пользователя, like = 0 отменяет. Нужна авторизация.
     *
     * @tags import_categories
     * @name LikeImportCategory
     * @summary Лайк
     * @request POST:/api/import_categories/{id}/like
     * @secure
     */
    likeImportCategory: (
      id: number,
      body: SerializerLikeRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        SerializerResponse & {
          data?: SerializerLikeSerializer;
        },
        SerializerResponse
      >({
        path: `/api/import_categories/${id}/like`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Черновик → опубликована: два поля по теме и описание. Только свой черновик. Нужна авторизация (гостю 401).
     *
     * @tags import_categories
     * @name PublishImportCategory
     * @summary Публикация услуги
     * @request PUT:/api/import_categories/{id}/publish
     * @secure
     */
    publishImportCategory: (
      id: number,
      body: SerializerPublishRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        SerializerResponse & {
          data?: SerializerImportCategorySerializer;
        },
        SerializerResponse
      >({
        path: `/api/import_categories/${id}/publish`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Проверяет логин и пароль и выдаёт JWT. Токен передаётся в остальных запросах заголовком Authorization: Bearer <токен>.
     *
     * @tags users
     * @name LoginUser
     * @summary Аутентификация
     * @request POST:/api/users/login
     */
    loginUser: (body: SerializerUserRequest, params: RequestParams = {}) =>
      this.request<
        SerializerResponse & {
          data?: SerializerLoginResponse;
        },
        SerializerResponse
      >({
        path: `/api/users/login`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Отзывает текущий JWT: его идентификатор (jti) записывается в чёрный список Redis до конца срока действия токена. После этого токен не принимается (401).
     *
     * @tags users
     * @name LogoutUser
     * @summary Деавторизация
     * @request POST:/api/users/logout
     * @secure
     */
    logoutUser: (params: RequestParams = {}) =>
      this.request<SerializerResponse, SerializerResponse>({
        path: `/api/users/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт пользователя. Пароль хранится в виде хеша bcrypt. is_moderator с клиента не принимается.
     *
     * @tags users
     * @name RegisterUser
     * @summary Регистрация пользователя
     * @request POST:/api/users/register
     */
    registerUser: (body: SerializerUserRequest, params: RequestParams = {}) =>
      this.request<
        SerializerResponse & {
          data?: SerializerUserSerializer;
        },
        SerializerResponse
      >({
        path: `/api/users/register`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
