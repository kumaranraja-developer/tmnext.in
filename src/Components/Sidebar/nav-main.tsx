"use client"

import { useAppContext } from "../../pages/GlobalContext/AppContaxt"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./sidebar"
import { Collapsible,
  CollapsibleContent,
  CollapsibleTrigger } from "../collapsible"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    currentComponent?: string // used for non-submenu items
    items?: {
      title: string
      currentComponent: string
      url: string
    }[]
  }[]
}) {
  const { setCurrentComponent } = useAppContext()
  const navigate = useNavigate()

  const handleNavigate = (component: string) => {
    setCurrentComponent(component)
    navigate(`/admin/${component}`)
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubMenu = Array.isArray(item.items) && item.items.length > 0

          if (hasSubMenu) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items!.map((subItem) => (

                        <SidebarMenuSubItem
                          key={subItem.title}
                          onClick={() => handleNavigate(subItem.currentComponent)}
                        >
                          <SidebarMenuSubButton>
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          // No submenu — render as direct link
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() =>
                  handleNavigate(item.currentComponent ?? "")
                }
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
