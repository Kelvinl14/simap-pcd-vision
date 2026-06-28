import { useEffect, useState, useMemo } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  Popup,
  Tooltip as MapTooltip,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, Users, MapPin, Activity } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { StatCard } from "@/components/dashboard/StatCard";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { pcdService, Pcd } from "@/services/pcd.service";
import { institutionsService, Institution } from "@/services/institutions.service";

// @ts-expect-error: Ignore the type error for the _getIconUrl method
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const labelMap: Record<string, string> = {
  FISICA: "Física",
  VISUAL: "Visual",
  AUDITIVA: "Auditiva",
  INTELECTUAL: "Intelectual",
  MULTIPLA: "Múltipla",
  PSICOSSOCIAL: "Psicossocial",
};

// Centróides conhecidos
const CITY_CENTROIDS: Record<string, [number, number]> = {
  Caxias: [-4.86, -43.35],
  Teresina: [-5.09, -42.80],
  Timon: [-5.10, -42.83],
};

const Mapa = () => {
    const [pcds, setPcds] = useState<Pcd[]>([]);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [filters, setFilters] = useState({
        disability: "all",
        ageGroup: "all",
        gender: "all",
        institution: "all",
    });

    useEffect(() => {
        const loadMapData = async () => {
            setIsLoading(true);
            try {
                const [pcdList, instList] = await Promise.all([
                    pcdService.findAll({ limit: 200 }),
                    institutionsService.findAll(),
                ]);
                setPcds(pcdList.data);
                setInstitutions(instList);
            } catch (error) {
                console.error("Erro ao carregar dados do mapa:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadMapData();
    }, []);

    // Gera coordenadas geográficas baseadas no ID da PCD e sua cidade (consistente e determinístico)
    const pcdPoints = useMemo(() => {
        return pcds.map((item) => {
            const cityName = item.city || "Caxias";
            const baseCoord = CITY_CENTROIDS[cityName] || CITY_CENTROIDS["Caxias"];
            
            // Gerar offset consistente usando hash simples do UUID do registro
            let hash = 0;
            for (let i = 0; i < item.id.length; i++) {
                hash = item.id.charCodeAt(i) + ((hash << 5) - hash);
            }
            
            const offsetLat = ((hash % 100) / 1000) * 0.4; // offset suave
            const offsetLng = (((hash >> 8) % 100) / 1000) * 0.4;

            // Idade calculada
            let calculatedAge = 30;
            if (item.birthDate) {
                calculatedAge = new Date().getFullYear() - new Date(item.birthDate).getFullYear();
            }

            // Deficiência primária
            const defType = item.disabilities[0]?.type || "FISICA";

            return {
                id: item.id,
                name: item.name,
                lat: baseCoord[0] + offsetLat,
                lng: baseCoord[1] + offsetLng,
                neighborhood: item.neighborhood || item.city || "Centro",
                disability: labelMap[defType] || defType,
                gender: item.sex === "MASCULINO" ? "Masculino" : item.sex === "FEMININO" ? "Feminino" : "Outro",
                age: calculatedAge,
                institutionId: item.institutionId || "",
                institutionName: item.institution?.name || "Nenhuma",
            };
        });
    }, [pcds]);

    const filteredData = useMemo(() => {
        return pcdPoints.filter((item) => {
            if (filters.disability !== "all" && item.disability !== filters.disability) return false;
            if (filters.gender !== "all" && item.gender !== filters.gender) return false;
            if (filters.institution !== "all" && item.institutionId !== filters.institution) return false;

            if (filters.ageGroup !== "all") {
                if (filters.ageGroup === "0-18" && item.age > 18) return false;
                if (filters.ageGroup === "19-59" && (item.age < 19 || item.age > 59)) return false;
                if (filters.ageGroup === "60+" && item.age < 60) return false;
            }

            return true;
        });
    }, [pcdPoints, filters]);

    const stats = useMemo(() => {
        const total = filteredData.length;
        const byDisability = filteredData.reduce((acc, item) => {
            acc[item.disability] = (acc[item.disability] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topRegion = Object.entries(
            filteredData.reduce((acc, item) => {
                acc[item.neighborhood] = (acc[item.neighborhood] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        ).sort((a, b) => b[1] - a[1])[0];

        return { total, byDisability, topRegion };
    }, [filteredData]);

    const topDisability = useMemo(() => {
        const entries = Object.entries(stats.byDisability);
        if (entries.length === 0) return "-";
        return entries.sort((a, b) => b[1] - a[1])[0][0];
    }, [stats.byDisability]);

    if (isLoading) {
        return (
          <div className="space-y-6 animate-fade-in flex flex-col justify-center items-center h-[500px]">
            <span className="text-muted-foreground text-lg">Carregando mapa georreferenciado...</span>
          </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">Mapa de PCDs</h1>
                <p className="page-description">
                    Visualização georreferenciada dos cadastros baseada nas instituições e residências.
                </p>
            </div>
           
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 stagger-children">
                <StatCard
                    title="Total Exibido"
                    value={stats.total}
                    icon={<Users className="h-full w-full text-muted-foreground" />}
                    description="Total de cadastros no mapa"
                />
                <StatCard
                    title="Maior Concentração"
                    value={stats.topRegion ? stats.topRegion[0] : "-"}
                    icon={<MapPin className="h-full w-full text-muted-foreground" />}
                    description={stats.topRegion ? `${stats.topRegion[1]} cadastros` : "Sem dados"}
                />
                <StatCard
                    title="Deficiência Predominante"
                    value={topDisability}
                    icon={<Activity className="h-full w-full text-muted-foreground" />}
                    description="Grupo com maior volume no mapa"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-4 items-stretch">
                {/* Filters Sidebar */}
                <div className="space-y-6 lg:col-span-1 h-full overflow-y-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filtros
                            </CardTitle>
                            <CardDescription>Refine a visualização do mapa</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Tipo de Deficiência</Label>
                                <Select
                                    value={filters.disability}
                                    onValueChange={(v) => setFilters({ ...filters, disability: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas</SelectItem>
                                        <SelectItem value="Física">Física</SelectItem>
                                        <SelectItem value="Visual">Visual</SelectItem>
                                        <SelectItem value="Auditiva">Auditiva</SelectItem>
                                        <SelectItem value="Intelectual">Intelectual</SelectItem>
                                        <SelectItem value="Múltipla">Múltipla</SelectItem>
                                        <SelectItem value="Psicossocial">Psicossocial</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Faixa Etária</Label>
                                <Select
                                    value={filters.ageGroup}
                                    onValueChange={(v) => setFilters({ ...filters, ageGroup: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas</SelectItem>
                                        <SelectItem value="0-18">0 - 18 anos</SelectItem>
                                        <SelectItem value="19-59">19 - 59 anos</SelectItem>
                                        <SelectItem value="60+">60+ anos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Gênero</Label>
                                <Select
                                    value={filters.gender}
                                    onValueChange={(v) => setFilters({ ...filters, gender: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="Masculino">Masculino</SelectItem>
                                        <SelectItem value="Feminino">Feminino</SelectItem>
                                        <SelectItem value="Outro">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Instituição de Referência</Label>
                                <Select
                                    value={filters.institution}
                                    onValueChange={(v) => setFilters({ ...filters, institution: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas</SelectItem>
                                        {institutions.map((i) => (
                                            <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setFilters({
                                    disability: "all",
                                    ageGroup: "all",
                                    gender: "all",
                                    institution: "all",
                                })}
                            >
                                Limpar Filtros
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Distribuição</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {Object.entries(stats.byDisability)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([type, count]) => (
                                        <div key={type} className="flex items-center justify-between text-sm">
                                            <span>{type}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{count}</span>
                                                <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
                                                    <div
                                                        className="h-full bg-primary"
                                                        style={{ width: `${(count / (stats.total || 1)) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Map Area */}
                <div className="min-h-[400px] overflow-hidden rounded-xl border bg-card lg:col-span-3">
                    <MapContainer
                        center={[-4.86, -43.35]}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {filteredData.map((point) => (
                            <CircleMarker
                                key={point.id}
                                center={[point.lat, point.lng]}
                                radius={8}
                                pathOptions={{
                                    fillColor: point.gender === "Masculino" ? "#3b82f6" : point.gender === "Feminino" ? "#ec4899" : "#10b981",
                                    color: "#fff",
                                    weight: 1,
                                    opacity: 1,
                                    fillOpacity: 0.8,
                                }}
                            >
                                <Popup>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold">{point.name}</h3>
                                        <div className="space-y-1 text-xs">
                                            <p><span className="font-medium">Bairro:</span> {point.neighborhood}</p>
                                            <p><span className="font-medium">Deficiência:</span> {point.disability}</p>
                                            <p><span className="font-medium">Idade:</span> {point.age} anos</p>
                                            <p><span className="font-medium">Gênero:</span> {point.gender}</p>
                                            <p><span className="font-medium">Instituição:</span> {point.institutionName}</p>
                                        </div>
                                    </div>
                                </Popup>
                                <MapTooltip>{point.disability} - {point.name}</MapTooltip>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default Mapa;
