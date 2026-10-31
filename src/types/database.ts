export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      adelanto_items: {
        Row: {
          adelanto_id: string
          bruto: number
          cantidad: number
          descripcion: string
          id: string
          monto_unitario: number
          porc_profesional: number
          sesion_id: string | null
        }
        Insert: {
          adelanto_id: string
          bruto?: number
          cantidad?: number
          descripcion: string
          id?: string
          monto_unitario?: number
          porc_profesional?: number
          sesion_id?: string | null
        }
        Update: {
          adelanto_id?: string
          bruto?: number
          cantidad?: number
          descripcion?: string
          id?: string
          monto_unitario?: number
          porc_profesional?: number
          sesion_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adelanto_items_adelanto_id_fkey"
            columns: ["adelanto_id"]
            isOneToOne: false
            referencedRelation: "adelantos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adelanto_items_sesion_id_fkey"
            columns: ["sesion_id"]
            isOneToOne: false
            referencedRelation: "sesiones"
            referencedColumns: ["id"]
          },
        ]
      }
      adelantos: {
        Row: {
          caja_ahorro: string | null
          cantidad_sesiones: number | null
          concepto: string
          created_at: string
          estado: string
          fecha: string
          id: string
          monto: number
          monto_bruto: number | null
          monto_descuento: number | null
          numero: number
          periodo: string
          persona_id: string
          porc_descuento: number | null
          sesion_id: string | null
        }
        Insert: {
          caja_ahorro?: string | null
          cantidad_sesiones?: number | null
          concepto?: string
          created_at?: string
          estado?: string
          fecha?: string
          id?: string
          monto: number
          monto_bruto?: number | null
          monto_descuento?: number | null
          numero?: number
          periodo: string
          persona_id: string
          porc_descuento?: number | null
          sesion_id?: string | null
        }
        Update: {
          caja_ahorro?: string | null
          cantidad_sesiones?: number | null
          concepto?: string
          created_at?: string
          estado?: string
          fecha?: string
          id?: string
          monto?: number
          monto_bruto?: number | null
          monto_descuento?: number | null
          numero?: number
          periodo?: string
          persona_id?: string
          porc_descuento?: number | null
          sesion_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adelantos_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adelantos_sesion_id_fkey"
            columns: ["sesion_id"]
            isOneToOne: false
            referencedRelation: "sesiones"
            referencedColumns: ["id"]
          },
        ]
      }
      alumnos: {
        Row: {
          beca: number | null
          created_at: string
          deleted_at: string | null
          id: string
          matricula: number | null
          nacionalidad: string | null
          persona_id: string
          presupuesto_ingreso: number | null
          rue: boolean
          sede_id: string | null
          turno: string | null
          updated_at: string
        }
        Insert: {
          beca?: number | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          matricula?: number | null
          nacionalidad?: string | null
          persona_id: string
          presupuesto_ingreso?: number | null
          rue?: boolean
          sede_id?: string | null
          turno?: string | null
          updated_at?: string
        }
        Update: {
          beca?: number | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          matricula?: number | null
          nacionalidad?: string | null
          persona_id?: string
          presupuesto_ingreso?: number | null
          rue?: boolean
          sede_id?: string | null
          turno?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alumnos_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: true
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alumnos_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
        ]
      }
      asistencias: {
        Row: {
          created_at: string
          estado: string | null
          fecha: string
          hora_entrada: string | null
          hora_salida: string | null
          id: string
          observacion: string | null
          origen: string
          persona_id: string
          registrado_por: string | null
          sede_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          estado?: string | null
          fecha?: string
          hora_entrada?: string | null
          hora_salida?: string | null
          id?: string
          observacion?: string | null
          origen?: string
          persona_id: string
          registrado_por?: string | null
          sede_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          estado?: string | null
          fecha?: string
          hora_entrada?: string | null
          hora_salida?: string | null
          id?: string
          observacion?: string | null
          origen?: string
          persona_id?: string
          registrado_por?: string | null
          sede_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asistencias_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asistencias_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
        ]
      }
      auditoria_liquidacion: {
        Row: {
          accion: string
          created_at: string
          detalle: Json | null
          id: string
          liquidacion_id: string | null
          usuario: string | null
        }
        Insert: {
          accion: string
          created_at?: string
          detalle?: Json | null
          id?: string
          liquidacion_id?: string | null
          usuario?: string | null
        }
        Update: {
          accion?: string
          created_at?: string
          detalle?: Json | null
          id?: string
          liquidacion_id?: string | null
          usuario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auditoria_liquidacion_liquidacion_id_fkey"
            columns: ["liquidacion_id"]
            isOneToOne: false
            referencedRelation: "liquidaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      bancos: {
        Row: {
          activo: boolean
          created_at: string
          id: string
          nombre: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          id?: string
          nombre: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      cargos: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          programa_id: string | null
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          programa_id?: string | null
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          programa_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cargos_programa_id_fkey"
            columns: ["programa_id"]
            isOneToOne: false
            referencedRelation: "programas"
            referencedColumns: ["id"]
          },
        ]
      }
      cobro_pagos: {
        Row: {
          banco_id: string | null
          cobro_id: string
          cuenta_id: string | null
          forma_pago: string
          id: string
          monto: number
          nro_transferencia: string | null
        }
        Insert: {
          banco_id?: string | null
          cobro_id: string
          cuenta_id?: string | null
          forma_pago: string
          id?: string
          monto?: number
          nro_transferencia?: string | null
        }
        Update: {
          banco_id?: string | null
          cobro_id?: string
          cuenta_id?: string | null
          forma_pago?: string
          id?: string
          monto?: number
          nro_transferencia?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cobro_pagos_banco_id_fkey"
            columns: ["banco_id"]
            isOneToOne: false
            referencedRelation: "bancos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobro_pagos_cobro_id_fkey"
            columns: ["cobro_id"]
            isOneToOne: false
            referencedRelation: "cobros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobro_pagos_cuenta_id_fkey"
            columns: ["cuenta_id"]
            isOneToOne: false
            referencedRelation: "cuentas_bancarias"
            referencedColumns: ["id"]
          },
        ]
      }
      cobros: {
        Row: {
          banco_id: string | null
          created_at: string
          cuenta_id: string | null
          documento_receptor: string
          factura_cdc: string | null
          fecha: string
          forma_pago: string
          id: string
          monto: number
          nro_transferencia: string | null
          referencia: string | null
        }
        Insert: {
          banco_id?: string | null
          created_at?: string
          cuenta_id?: string | null
          documento_receptor: string
          factura_cdc?: string | null
          fecha?: string
          forma_pago?: string
          id?: string
          monto: number
          nro_transferencia?: string | null
          referencia?: string | null
        }
        Update: {
          banco_id?: string | null
          created_at?: string
          cuenta_id?: string | null
          documento_receptor?: string
          factura_cdc?: string | null
          fecha?: string
          forma_pago?: string
          id?: string
          monto?: number
          nro_transferencia?: string | null
          referencia?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cobros_banco_id_fkey"
            columns: ["banco_id"]
            isOneToOne: false
            referencedRelation: "bancos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobros_cuenta_id_fkey"
            columns: ["cuenta_id"]
            isOneToOne: false
            referencedRelation: "cuentas_bancarias"
            referencedColumns: ["id"]
          },
        ]
      }
      conceptos_salario: {
        Row: {
          activo: boolean
          codigo: string
          id: string
          incluye_base_aguinaldo: boolean
          incluye_base_ips: boolean
          incluye_base_vacaciones: boolean
          nombre: string
          orden: number
          remunerativo: boolean
          tipo: string
        }
        Insert: {
          activo?: boolean
          codigo: string
          id?: string
          incluye_base_aguinaldo?: boolean
          incluye_base_ips?: boolean
          incluye_base_vacaciones?: boolean
          nombre: string
          orden?: number
          remunerativo?: boolean
          tipo: string
        }
        Update: {
          activo?: boolean
          codigo?: string
          id?: string
          incluye_base_aguinaldo?: boolean
          incluye_base_ips?: boolean
          incluye_base_vacaciones?: boolean
          nombre?: string
          orden?: number
          remunerativo?: boolean
          tipo?: string
        }
        Relationships: []
      }
      cuentas_bancarias: {
        Row: {
          activo: boolean
          banco_id: string
          created_at: string
          id: string
          moneda: string
          numero: string
          tipo: string
          titular: string | null
        }
        Insert: {
          activo?: boolean
          banco_id: string
          created_at?: string
          id?: string
          moneda?: string
          numero: string
          tipo?: string
          titular?: string | null
        }
        Update: {
          activo?: boolean
          banco_id?: string
          created_at?: string
          id?: string
          moneda?: string
          numero?: string
          tipo?: string
          titular?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cuentas_bancarias_banco_id_fkey"
            columns: ["banco_id"]
            isOneToOne: false
            referencedRelation: "bancos"
            referencedColumns: ["id"]
          },
        ]
      }
      facturas: {
        Row: {
          cdc: string
          condicion: string | null
          created_at: string
          documento_receptor: string
          estado: string
          exento: number
          fecha_aprobacion: string | null
          fecha_emision: string | null
          id: string
          iva_10: number
          iva_5: number
          monto_gravado_10: number
          monto_gravado_5: number
          monto_total: number
          nombre_informado: string | null
          numero_documento: string | null
          periodo: string | null
          timbrado: string | null
          tipo_comprobante: string | null
          tipo_identificacion: string | null
          tipo_registro: string | null
        }
        Insert: {
          cdc: string
          condicion?: string | null
          created_at?: string
          documento_receptor: string
          estado?: string
          exento?: number
          fecha_aprobacion?: string | null
          fecha_emision?: string | null
          id?: string
          iva_10?: number
          iva_5?: number
          monto_gravado_10?: number
          monto_gravado_5?: number
          monto_total?: number
          nombre_informado?: string | null
          numero_documento?: string | null
          periodo?: string | null
          timbrado?: string | null
          tipo_comprobante?: string | null
          tipo_identificacion?: string | null
          tipo_registro?: string | null
        }
        Update: {
          cdc?: string
          condicion?: string | null
          created_at?: string
          documento_receptor?: string
          estado?: string
          exento?: number
          fecha_aprobacion?: string | null
          fecha_emision?: string | null
          id?: string
          iva_10?: number
          iva_5?: number
          monto_gravado_10?: number
          monto_gravado_5?: number
          monto_total?: number
          nombre_informado?: string | null
          numero_documento?: string | null
          periodo?: string | null
          timbrado?: string | null
          tipo_comprobante?: string | null
          tipo_identificacion?: string | null
          tipo_registro?: string | null
        }
        Relationships: []
      }
      feriados: {
        Row: {
          created_at: string
          estado_validacion: string
          fecha: string
          fecha_original: string | null
          fuente: string | null
          movilidad: string
          nombre: string
          norma: string | null
          nota: string | null
          pais: string
          tipo: string
          trasladado_de: string | null
          updated_at: string
          validado: boolean
        }
        Insert: {
          created_at?: string
          estado_validacion?: string
          fecha: string
          fecha_original?: string | null
          fuente?: string | null
          movilidad?: string
          nombre: string
          norma?: string | null
          nota?: string | null
          pais?: string
          tipo?: string
          trasladado_de?: string | null
          updated_at?: string
          validado?: boolean
        }
        Update: {
          created_at?: string
          estado_validacion?: string
          fecha?: string
          fecha_original?: string | null
          fuente?: string | null
          movilidad?: string
          nombre?: string
          norma?: string | null
          nota?: string | null
          pais?: string
          tipo?: string
          trasladado_de?: string | null
          updated_at?: string
          validado?: boolean
        }
        Relationships: []
      }
      horarios: {
        Row: {
          actividad: string | null
          activo: boolean
          aula: string | null
          created_at: string
          deleted_at: string | null
          dia_semana: number
          hora_fin: string
          hora_inicio: string
          id: string
          persona_id: string
          sede_id: string
          updated_at: string
          vigente_desde: string | null
          vigente_hasta: string | null
        }
        Insert: {
          actividad?: string | null
          activo?: boolean
          aula?: string | null
          created_at?: string
          deleted_at?: string | null
          dia_semana: number
          hora_fin: string
          hora_inicio: string
          id?: string
          persona_id: string
          sede_id: string
          updated_at?: string
          vigente_desde?: string | null
          vigente_hasta?: string | null
        }
        Update: {
          actividad?: string | null
          activo?: boolean
          aula?: string | null
          created_at?: string
          deleted_at?: string | null
          dia_semana?: number
          hora_fin?: string
          hora_inicio?: string
          id?: string
          persona_id?: string
          sede_id?: string
          updated_at?: string
          vigente_desde?: string | null
          vigente_hasta?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "horarios_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "horarios_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
        ]
      }
      ingreso_facturas: {
        Row: {
          created_at: string
          factura_cdc: string
          id: string
          ingreso_id: string
        }
        Insert: {
          created_at?: string
          factura_cdc: string
          id?: string
          ingreso_id: string
        }
        Update: {
          created_at?: string
          factura_cdc?: string
          id?: string
          ingreso_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingreso_facturas_factura_cdc_fkey"
            columns: ["factura_cdc"]
            isOneToOne: false
            referencedRelation: "facturas"
            referencedColumns: ["cdc"]
          },
          {
            foreignKeyName: "ingreso_facturas_ingreso_id_fkey"
            columns: ["ingreso_id"]
            isOneToOne: false
            referencedRelation: "ingresos"
            referencedColumns: ["id"]
          },
        ]
      }
      ingreso_items: {
        Row: {
          cantidad: number
          id: string
          ingreso_id: string
          precio_unitario: number
          profesional: string | null
          terapia: string
          total: number
        }
        Insert: {
          cantidad?: number
          id?: string
          ingreso_id: string
          precio_unitario?: number
          profesional?: string | null
          terapia: string
          total?: number
        }
        Update: {
          cantidad?: number
          id?: string
          ingreso_id?: string
          precio_unitario?: number
          profesional?: string | null
          terapia?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "ingreso_items_ingreso_id_fkey"
            columns: ["ingreso_id"]
            isOneToOne: false
            referencedRelation: "ingresos"
            referencedColumns: ["id"]
          },
        ]
      }
      ingresos: {
        Row: {
          alumno_paciente: string | null
          cantidad: number
          created_at: string
          documento: string | null
          estado: string
          factura_cdc: string | null
          id: string
          met_pago: string | null
          precio_unitario: number
          profesional: string | null
          terapia: string
          total: number
          usuario: string
        }
        Insert: {
          alumno_paciente?: string | null
          cantidad?: number
          created_at?: string
          documento?: string | null
          estado?: string
          factura_cdc?: string | null
          id?: string
          met_pago?: string | null
          precio_unitario?: number
          profesional?: string | null
          terapia: string
          total?: number
          usuario: string
        }
        Update: {
          alumno_paciente?: string | null
          cantidad?: number
          created_at?: string
          documento?: string | null
          estado?: string
          factura_cdc?: string | null
          id?: string
          met_pago?: string | null
          precio_unitario?: number
          profesional?: string | null
          terapia?: string
          total?: number
          usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingresos_factura_cdc_fkey"
            columns: ["factura_cdc"]
            isOneToOne: false
            referencedRelation: "facturas"
            referencedColumns: ["cdc"]
          },
        ]
      }
      jornadas: {
        Row: {
          codigo: string
          created_at: string
          horas_diarias: number
          horas_semanales: number
          id: string
          nombre: string
          tipo: string
        }
        Insert: {
          codigo: string
          created_at?: string
          horas_diarias: number
          horas_semanales: number
          id?: string
          nombre: string
          tipo: string
        }
        Update: {
          codigo?: string
          created_at?: string
          horas_diarias?: number
          horas_semanales?: number
          id?: string
          nombre?: string
          tipo?: string
        }
        Relationships: []
      }
      liquidacion_detalle: {
        Row: {
          base_calculo: number | null
          cantidad: number | null
          concepto_codigo: string
          descripcion: string | null
          id: string
          importe: number
          liquidacion_id: string
          orden: number
          tasa: number | null
        }
        Insert: {
          base_calculo?: number | null
          cantidad?: number | null
          concepto_codigo: string
          descripcion?: string | null
          id?: string
          importe: number
          liquidacion_id: string
          orden?: number
          tasa?: number | null
        }
        Update: {
          base_calculo?: number | null
          cantidad?: number | null
          concepto_codigo?: string
          descripcion?: string | null
          id?: string
          importe?: number
          liquidacion_id?: string
          orden?: number
          tasa?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "liquidacion_detalle_liquidacion_id_fkey"
            columns: ["liquidacion_id"]
            isOneToOne: false
            referencedRelation: "liquidaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      liquidaciones: {
        Row: {
          aprobado_por: string | null
          calculado_por: string | null
          created_at: string
          estado: string
          fecha_aprobacion: string | null
          id: string
          neto_pagar: number
          numero: number
          periodo: string
          persona_id: string
          total_aportes_patronales: number
          total_descuentos: number
          total_haberes: number
          updated_at: string
          version: number
        }
        Insert: {
          aprobado_por?: string | null
          calculado_por?: string | null
          created_at?: string
          estado?: string
          fecha_aprobacion?: string | null
          id?: string
          neto_pagar?: number
          numero?: number
          periodo: string
          persona_id: string
          total_aportes_patronales?: number
          total_descuentos?: number
          total_haberes?: number
          updated_at?: string
          version?: number
        }
        Update: {
          aprobado_por?: string | null
          calculado_por?: string | null
          created_at?: string
          estado?: string
          fecha_aprobacion?: string | null
          id?: string
          neto_pagar?: number
          numero?: number
          periodo?: string
          persona_id?: string
          total_aportes_patronales?: number
          total_descuentos?: number
          total_haberes?: number
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "liquidaciones_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      modulos_pantallas: {
        Row: {
          activo: boolean
          created_at: string
          id: string
          modulo: string
          nombre: string | null
          orden: number
          pantalla: string
          ruta: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          id?: string
          modulo: string
          nombre?: string | null
          orden?: number
          pantalla: string
          ruta?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          id?: string
          modulo?: string
          nombre?: string | null
          orden?: number
          pantalla?: string
          ruta?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      novedades: {
        Row: {
          cantidad: number
          created_at: string
          estado: string
          fecha_desde: string | null
          fecha_hasta: string | null
          id: string
          justificacion: string | null
          periodo: string
          persona_id: string
          tipo: string
          tratamiento: string | null
          unidad: string
          updated_at: string
        }
        Insert: {
          cantidad?: number
          created_at?: string
          estado?: string
          fecha_desde?: string | null
          fecha_hasta?: string | null
          id?: string
          justificacion?: string | null
          periodo: string
          persona_id: string
          tipo: string
          tratamiento?: string | null
          unidad?: string
          updated_at?: string
        }
        Update: {
          cantidad?: number
          created_at?: string
          estado?: string
          fecha_desde?: string | null
          fecha_hasta?: string | null
          id?: string
          justificacion?: string | null
          periodo?: string
          persona_id?: string
          tipo?: string
          tratamiento?: string | null
          unidad?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "novedades_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      parametros_legales: {
        Row: {
          articulo: string | null
          codigo: string
          created_at: string
          fuente: string | null
          id: string
          nombre: string
          norma: string | null
          unidad: string
          validado: boolean
          valor: number
          vigencia_desde: string
          vigencia_hasta: string | null
        }
        Insert: {
          articulo?: string | null
          codigo: string
          created_at?: string
          fuente?: string | null
          id?: string
          nombre: string
          norma?: string | null
          unidad?: string
          validado?: boolean
          valor: number
          vigencia_desde: string
          vigencia_hasta?: string | null
        }
        Update: {
          articulo?: string | null
          codigo?: string
          created_at?: string
          fuente?: string | null
          id?: string
          nombre?: string
          norma?: string | null
          unidad?: string
          validado?: boolean
          valor?: number
          vigencia_desde?: string
          vigencia_hasta?: string | null
        }
        Relationships: []
      }
      permisos_rol: {
        Row: {
          created_at: string
          id: string
          pantalla_id: string
          puede_actualizar: boolean
          puede_consultar: boolean
          puede_crear: boolean
          puede_eliminar: boolean
          rol_id: string
          sede_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          pantalla_id: string
          puede_actualizar?: boolean
          puede_consultar?: boolean
          puede_crear?: boolean
          puede_eliminar?: boolean
          rol_id: string
          sede_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          pantalla_id?: string
          puede_actualizar?: boolean
          puede_consultar?: boolean
          puede_crear?: boolean
          puede_eliminar?: boolean
          rol_id?: string
          sede_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "permisos_rol_pantalla_id_fkey"
            columns: ["pantalla_id"]
            isOneToOne: false
            referencedRelation: "modulos_pantallas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permisos_rol_rol_id_fkey"
            columns: ["rol_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permisos_rol_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
        ]
      }
      persona_programas: {
        Row: {
          persona_id: string
          programa_id: string
        }
        Insert: {
          persona_id: string
          programa_id: string
        }
        Update: {
          persona_id?: string
          programa_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "persona_programas_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persona_programas_programa_id_fkey"
            columns: ["programa_id"]
            isOneToOne: false
            referencedRelation: "programas"
            referencedColumns: ["id"]
          },
        ]
      }
      persona_relaciones: {
        Row: {
          created_at: string
          deleted_at: string | null
          es_responsable_pago: boolean
          id: string
          persona_id: string
          relacionada_id: string
          tipo: string
          updated_at: string
          vigencia_desde: string
          vigencia_hasta: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          es_responsable_pago?: boolean
          id?: string
          persona_id: string
          relacionada_id: string
          tipo: string
          updated_at?: string
          vigencia_desde?: string
          vigencia_hasta?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          es_responsable_pago?: boolean
          id?: string
          persona_id?: string
          relacionada_id?: string
          tipo?: string
          updated_at?: string
          vigencia_desde?: string
          vigencia_hasta?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "persona_relaciones_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persona_relaciones_relacionada_id_fkey"
            columns: ["relacionada_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      persona_roles: {
        Row: {
          activo: boolean
          created_at: string
          deleted_at: string | null
          id: string
          persona_id: string
          rol_negocio: string
          sede_id: string | null
          updated_at: string
          vigencia_desde: string
          vigencia_hasta: string | null
        }
        Insert: {
          activo?: boolean
          created_at?: string
          deleted_at?: string | null
          id?: string
          persona_id: string
          rol_negocio: string
          sede_id?: string | null
          updated_at?: string
          vigencia_desde?: string
          vigencia_hasta?: string | null
        }
        Update: {
          activo?: boolean
          created_at?: string
          deleted_at?: string | null
          id?: string
          persona_id?: string
          rol_negocio?: string
          sede_id?: string | null
          updated_at?: string
          vigencia_desde?: string
          vigencia_hasta?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "persona_roles_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persona_roles_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
        ]
      }
      personal: {
        Row: {
          antiguedad_institucion: string | null
          caja_ahorro: string | null
          cargo: string | null
          created_at: string
          deleted_at: string | null
          experiencia_cargo: string | null
          fecha_ingreso: string | null
          formacion_academica: string | null
          id: string
          jornada_tipo: string | null
          logo: string | null
          modalidad_salarial: string | null
          persona_id: string
          programa: string | null
          programa_id: string | null
          regimen: string
          registro_profesional: string | null
          sector: string | null
          sede_id: string | null
          sueldo: number | null
          superior_id: string | null
          tiene_cd: boolean
          tiene_ci: boolean
          tiene_cv: boolean
          turno: string | null
          updated_at: string
        }
        Insert: {
          antiguedad_institucion?: string | null
          caja_ahorro?: string | null
          cargo?: string | null
          created_at?: string
          deleted_at?: string | null
          experiencia_cargo?: string | null
          fecha_ingreso?: string | null
          formacion_academica?: string | null
          id?: string
          jornada_tipo?: string | null
          logo?: string | null
          modalidad_salarial?: string | null
          persona_id: string
          programa?: string | null
          programa_id?: string | null
          regimen?: string
          registro_profesional?: string | null
          sector?: string | null
          sede_id?: string | null
          sueldo?: number | null
          superior_id?: string | null
          tiene_cd?: boolean
          tiene_ci?: boolean
          tiene_cv?: boolean
          turno?: string | null
          updated_at?: string
        }
        Update: {
          antiguedad_institucion?: string | null
          caja_ahorro?: string | null
          cargo?: string | null
          created_at?: string
          deleted_at?: string | null
          experiencia_cargo?: string | null
          fecha_ingreso?: string | null
          formacion_academica?: string | null
          id?: string
          jornada_tipo?: string | null
          logo?: string | null
          modalidad_salarial?: string | null
          persona_id?: string
          programa?: string | null
          programa_id?: string | null
          regimen?: string
          registro_profesional?: string | null
          sector?: string | null
          sede_id?: string | null
          sueldo?: number | null
          superior_id?: string | null
          tiene_cd?: boolean
          tiene_ci?: boolean
          tiene_cv?: boolean
          turno?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: true
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_programa_id_fkey"
            columns: ["programa_id"]
            isOneToOne: false
            referencedRelation: "programas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
        ]
      }
      personas: {
        Row: {
          apellidos: string
          ci: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          direccion: string | null
          email: string | null
          fecha_nacimiento: string | null
          id: string
          nombres: string
          observaciones: string | null
          pin_hash: string | null
          sexo: string | null
          telefono: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          apellidos: string
          ci?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          direccion?: string | null
          email?: string | null
          fecha_nacimiento?: string | null
          id?: string
          nombres: string
          observaciones?: string | null
          pin_hash?: string | null
          sexo?: string | null
          telefono?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          apellidos?: string
          ci?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          direccion?: string | null
          email?: string | null
          fecha_nacimiento?: string | null
          id?: string
          nombres?: string
          observaciones?: string | null
          pin_hash?: string | null
          sexo?: string | null
          telefono?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      preferencias_usuario: {
        Row: {
          created_at: string
          estilo: string
          id: string
          modo: string
          updated_at: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          estilo?: string
          id?: string
          modo?: string
          updated_at?: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          estilo?: string
          id?: string
          modo?: string
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "preferencias_usuario_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      programas: {
        Row: {
          activo: boolean
          caja_ahorro: string | null
          created_at: string
          descripcion: string | null
          fecha_inicio: string | null
          fecha_vencimiento: string | null
          id: string
          logo: string
          nombre: string
          resolucion: string | null
          rtp: string | null
          ruc: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          caja_ahorro?: string | null
          created_at?: string
          descripcion?: string | null
          fecha_inicio?: string | null
          fecha_vencimiento?: string | null
          id?: string
          logo?: string
          nombre: string
          resolucion?: string | null
          rtp?: string | null
          ruc?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          caja_ahorro?: string | null
          created_at?: string
          descripcion?: string | null
          fecha_inicio?: string | null
          fecha_vencimiento?: string | null
          id?: string
          logo?: string
          nombre?: string
          resolucion?: string | null
          rtp?: string | null
          ruc?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          codigo: string
          created_at: string
          deleted_at: string | null
          descripcion: string | null
          es_sistema: boolean
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          codigo: string
          created_at?: string
          deleted_at?: string | null
          descripcion?: string | null
          es_sistema?: boolean
          id?: string
          nombre: string
          updated_at?: string
        }
        Update: {
          codigo?: string
          created_at?: string
          deleted_at?: string | null
          descripcion?: string | null
          es_sistema?: boolean
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      sedes: {
        Row: {
          activa: boolean
          codigo: string
          created_at: string
          deleted_at: string | null
          direccion: string | null
          id: string
          nombre: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          activa?: boolean
          codigo: string
          created_at?: string
          deleted_at?: string | null
          direccion?: string | null
          id?: string
          nombre: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          activa?: boolean
          codigo?: string
          created_at?: string
          deleted_at?: string | null
          direccion?: string | null
          id?: string
          nombre?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sesiones: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string
          id: string
          monto: number
          porc_instituto: number
          porc_profesional: number
          tiempo_sesion: number
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion: string
          id?: string
          monto?: number
          porc_instituto?: number
          porc_profesional?: number
          tiempo_sesion?: number
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string
          id?: string
          monto?: number
          porc_instituto?: number
          porc_profesional?: number
          tiempo_sesion?: number
          updated_at?: string
        }
        Relationships: []
      }
      usuario_roles: {
        Row: {
          created_at: string
          id: string
          rol_id: string
          sede_id: string | null
          usuario_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rol_id: string
          sede_id?: string | null
          usuario_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rol_id?: string
          sede_id?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_roles_rol_id_fkey"
            columns: ["rol_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_roles_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_roles_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          activo: boolean
          auth_user_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          email: string
          es_admin_general: boolean
          id: string
          persona_id: string
          ultimo_acceso: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          auth_user_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email: string
          es_admin_general?: boolean
          id?: string
          persona_id: string
          ultimo_acceso?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          auth_user_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string
          es_admin_general?: boolean
          id?: string
          persona_id?: string
          ultimo_acceso?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: true
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      es_admin_general: { Args: never; Returns: boolean }
      puede: {
        Args: {
          p_accion: string
          p_modulo: string
          p_pantalla: string
          p_sede?: string
        }
        Returns: boolean
      }
      sedes_permitidas: { Args: never; Returns: string[] }
      usuario_actual_id: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
